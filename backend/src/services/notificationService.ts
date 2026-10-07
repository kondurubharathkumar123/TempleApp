import {
  Expo,
  ExpoPushMessage,
} from 'expo-server-sdk';

import { pool } from '../db';

const expo = new Expo();


// ========================================
// TYPES
// ========================================

export interface NotificationData {
  type: string;
  screen?: string;
  [key: string]: any;
}

export interface CreateNotificationOptions {
  title: string;
  body: string;
  notificationType: string;
  data?: NotificationData;
  targetType?: string;
  scheduledAt?: Date | null;
}


// ========================================
// CREATE NOTIFICATION RECORD
// ========================================

export async function createNotification(
  options: CreateNotificationOptions
) {
  const {
    title,
    body,
    notificationType,
    data = {
      type: notificationType,
    },
    targetType = 'all',
    scheduledAt = null,
  } = options;

  const status = scheduledAt
    ? 'scheduled'
    : 'pending';

  const result = await pool.query(
    `
    INSERT INTO notifications (
      title,
      body,
      notification_type,
      data,
      target_type,
      scheduled_at,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      title,
      body,
      notificationType,
      JSON.stringify(data),
      targetType,
      scheduledAt,
      status,
    ]
  );

  return result.rows[0];
}


// ========================================
// GET ALL ACTIVE DEVICES
// ========================================

async function getAllActiveDevices() {
  const result = await pool.query(`
    SELECT
      id,
      user_id,
      expo_push_token,
      platform
    FROM device_tokens
    WHERE is_active = TRUE
  `);

  return result.rows;
}


// ========================================
// SEND EXISTING NOTIFICATION RECORD
// ========================================

export async function sendNotificationRecord(
  notificationId: number
) {
  try {

    // ------------------------------------
    // GET NOTIFICATION
    // ------------------------------------

    const notificationResult =
      await pool.query(
        `
        SELECT
          id,
          title,
          body,
          notification_type,
          data,
          target_type,
          status
        FROM notifications
        WHERE id = $1
        `,
        [notificationId]
      );

    if (
      !notificationResult.rows.length
    ) {
      return {
        success: false,
        sent: 0,
        message:
          'Notification not found',
      };
    }

    const notification =
      notificationResult.rows[0];


    // ------------------------------------
    // PREVENT DUPLICATE SEND
    // ------------------------------------

    if (
      notification.status === 'sent'
    ) {
      return {
        success: true,
        sent: 0,
        message:
          'Notification already sent',
      };
    }


    // ------------------------------------
    // GET ACTIVE DEVICES
    // ------------------------------------

    const devices =
      await getAllActiveDevices();

    if (devices.length === 0) {

      await pool.query(
        `
        UPDATE notifications
        SET
          status = 'failed',
          updated_at =
            CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [notificationId]
      );

      return {
        success: false,
        sent: 0,
        message:
          'No active devices found',
      };
    }


    // ------------------------------------
    // PARSE DATA
    // ------------------------------------

    let notificationData =
      notification.data || {};

    if (
      typeof notificationData ===
      'string'
    ) {
      try {
        notificationData =
          JSON.parse(
            notificationData
          );
      } catch {
        notificationData = {};
      }
    }


    // ------------------------------------
    // BUILD PUSH MESSAGES
    // ------------------------------------

    const messages: ExpoPushMessage[] = [];

    const validDevices: any[] = [];

    for (
      const device of devices
    ) {

      if (
        !Expo.isExpoPushToken(
          device.expo_push_token
        )
      ) {
        console.warn(
          `Invalid Expo token for device ${device.id}`
        );

        continue;
      }

      messages.push({
        to: device.expo_push_token,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notificationData,
      });

      validDevices.push(device);
    }


    if (messages.length === 0) {

      await pool.query(
        `
        UPDATE notifications
        SET
          status = 'failed',
          updated_at =
            CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [notificationId]
      );

      return {
        success: false,
        sent: 0,
        message:
          'No valid Expo push tokens found',
      };
    }


    // ------------------------------------
    // CREATE DELIVERY RECORDS
    // ------------------------------------

    for (
      const device of validDevices
    ) {

      await pool.query(
        `
        INSERT INTO notification_deliveries (
          notification_id,
          user_id,
          device_token_id,
          expo_push_token,
          status
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          'pending'
        )
        `,
        [
          notificationId,
          device.user_id,
          device.id,
          device.expo_push_token,
        ]
      );
    }


    // ------------------------------------
    // MARK PROCESSING
    // ------------------------------------

    await pool.query(
      `
      UPDATE notifications
      SET
        status = 'processing',
        updated_at =
          CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [notificationId]
    );


    // ------------------------------------
    // SEND IN EXPO CHUNKS
    // ------------------------------------

    const chunks =
      expo.chunkPushNotifications(
        messages
      );

    let sentCount = 0;

    let messageIndex = 0;


    for (
      const chunk of chunks
    ) {

      try {

        const tickets =
          await expo.sendPushNotificationsAsync(
            chunk
          );


        for (
          let i = 0;
          i < tickets.length;
          i++
        ) {

          const ticket =
            tickets[i];

          const device =
            validDevices[
              messageIndex + i
            ];

          if (!device) {
            continue;
          }


          // ------------------------------
          // SUCCESS
          // ------------------------------

          if (
            ticket.status === 'ok'
          ) {

            sentCount++;

            await pool.query(
              `
              UPDATE notification_deliveries
              SET
                status = 'sent',
                expo_ticket_id = $1,
                sent_at =
                  CURRENT_TIMESTAMP
              WHERE
                notification_id = $2
                AND device_token_id = $3
              `,
              [
                ticket.id,
                notificationId,
                device.id,
              ]
            );

          }

          // ------------------------------
          // FAILED
          // ------------------------------

          else {

            await pool.query(
              `
              UPDATE notification_deliveries
              SET
                status = 'failed',
                error_message = $1
              WHERE
                notification_id = $2
                AND device_token_id = $3
              `,
              [
                JSON.stringify(
                  ticket
                ),
                notificationId,
                device.id,
              ]
            );

          }
        }


        messageIndex +=
          chunk.length;

      } catch (error) {

        console.error(
          'Expo chunk sending error:',
          error
        );


        for (
          let i = 0;
          i < chunk.length;
          i++
        ) {

          const device =
            validDevices[
              messageIndex + i
            ];

          if (!device) {
            continue;
          }

          await pool.query(
            `
            UPDATE notification_deliveries
            SET
              status = 'failed',
              error_message = $1
            WHERE
              notification_id = $2
              AND device_token_id = $3
            `,
            [
              String(error),
              notificationId,
              device.id,
            ]
          );
        }


        messageIndex +=
          chunk.length;
      }
    }


    // ------------------------------------
    // FINAL NOTIFICATION STATUS
    // ------------------------------------

    await pool.query(
      `
      UPDATE notifications
      SET
        status = $1,
        sent_at =
          CASE
            WHEN $2 > 0
            THEN CURRENT_TIMESTAMP
            ELSE sent_at
          END,
        updated_at =
          CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      [
        sentCount > 0
          ? 'sent'
          : 'failed',

        sentCount,

        notificationId,
      ]
    );


    return {
      success:
        sentCount > 0,

      sent:
        sentCount,

      totalDevices:
        validDevices.length,

      notificationId,
    };

  } catch (error) {

    console.error(
      'Send notification record error:',
      error
    );

    await pool.query(
      `
      UPDATE notifications
      SET
        status = 'failed',
        updated_at =
          CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [notificationId]
    );

    return {
      success: false,
      sent: 0,
      notificationId,
    };
  }
}


// ========================================
// SEND PUSH TO ONE USER
// ========================================

export async function sendPushNotificationToUser(
  userId: number,
  title: string,
  body: string,
  data: NotificationData = {
    type: 'system',
  }
) {
  try {

    const result =
      await pool.query(
        `
        SELECT
          id,
          expo_push_token,
          platform
        FROM device_tokens
        WHERE user_id = $1
          AND is_active = TRUE
        `,
        [userId]
      );

    if (!result.rows.length) {
      return {
        success: false,
        sent: 0,
      };
    }


    const messages: ExpoPushMessage[] = [];

    for (
      const device of result.rows
    ) {

      if (
        !Expo.isExpoPushToken(
          device.expo_push_token
        )
      ) {
        continue;
      }

      messages.push({
        to: device.expo_push_token,
        sound: 'default',
        title,
        body,
        data,
      });
    }


    if (!messages.length) {
      return {
        success: false,
        sent: 0,
      };
    }


    const chunks =
      expo.chunkPushNotifications(
        messages
      );

    let sentCount = 0;


    for (
      const chunk of chunks
    ) {

      try {

        const tickets =
          await expo.sendPushNotificationsAsync(
            chunk
          );

        for (
          const ticket of tickets
        ) {
          if (
            ticket.status === 'ok'
          ) {
            sentCount++;
          }
        }

      } catch (error) {

        console.error(
          'Expo user notification error:',
          error
        );

      }
    }


    return {
      success:
        sentCount > 0,
      sent:
        sentCount,
    };

  } catch (error) {

    console.error(
      'Send user notification error:',
      error
    );

    return {
      success: false,
      sent: 0,
    };
  }
}


// ========================================
// CREATE + SEND TO ALL USERS
// ========================================

export async function sendNotificationToAllUsers(
  title: string,
  body: string,
  data: NotificationData = {
    type: 'system',
  }
) {

  const notification =
    await createNotification({
      title,
      body,
      notificationType:
        data.type || 'system',
      data,
      targetType: 'all',
    });


  return await sendNotificationRecord(
    notification.id
  );
}