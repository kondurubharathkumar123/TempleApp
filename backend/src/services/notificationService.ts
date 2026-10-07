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

    if (!notificationResult.rows.length) {
      return {
        success: false,
        sent: 0,
        message: 'Notification not found',
      };
    }

    const notification =
      notificationResult.rows[0];


    // ------------------------------------
    // PREVENT DUPLICATE SEND
    // ------------------------------------

    if (notification.status === 'sent') {
      return {
        success: true,
        sent: 0,
        message: 'Notification already sent',
      };
    }

    // ------------------------------------
// CREATE IN-APP DELIVERY FOR ALL USERS
// ------------------------------------

await pool.query(
  `
    INSERT INTO notification_deliveries (
      notification_id,
      user_id,
      status
    )
    SELECT
      $1,
      id,
      'pending'
    FROM users
    ON CONFLICT (
      notification_id,
      user_id
    )
    DO NOTHING
  `,
  [notificationId]
);

    // ------------------------------------
    // GET ACTIVE DEVICES
    // ------------------------------------

    const devices =
      await getAllActiveDevices();

    if (devices.length === 0) {
  // No push-capable devices, but the notification
  // is still available in the in-app Notification Center.

  await pool.query(
    `
      UPDATE notification_deliveries
      SET status = 'no_device'
      WHERE notification_id = $1
        AND status = 'pending'
    `,
    [notificationId]
  );

  await pool.query(
    `
      UPDATE notifications
      SET
        status = 'sent',
        sent_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
    [notificationId]
  );

  return {
    success: true,
    sent: 0,
    notificationId,
    message:
      'Published to notification center; no active push devices',
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
          JSON.parse(notificationData);
      } catch {
        notificationData = {};
      }
    }


    // ------------------------------------
    // BUILD PUSH MESSAGES
    // ------------------------------------

    const messages: ExpoPushMessage[] = [];

    const validDevices: any[] = [];

    for (const device of devices) {

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
            updated_at = CURRENT_TIMESTAMP
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
    // CREATE ONE DELIVERY PER USER
    // ------------------------------------

    const uniqueUsers =
      new Map<number, any>();

    for (const device of validDevices) {
      if (
        !uniqueUsers.has(
          device.user_id
        )
      ) {
        uniqueUsers.set(
          device.user_id,
          device
        );
      }
    }

    for (
      const device of
      uniqueUsers.values()
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
          ON CONFLICT (
            notification_id,
            user_id
          )
          DO NOTHING
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

    for (const chunk of chunks) {
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
          const ticket = tickets[i];

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
                  expo_ticket_id =
                    COALESCE(
                      expo_ticket_id,
                      $1
                    ),
                  sent_at =
                    COALESCE(
                      sent_at,
                      CURRENT_TIMESTAMP
                    )
                WHERE
                  notification_id = $2
                  AND user_id = $3
              `,
              [
                ticket.id,
                notificationId,
                device.user_id,
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
                  status =
                    CASE
                      WHEN status = 'sent'
                      THEN status
                      ELSE 'failed'
                    END,
                  error_message = $1
                WHERE
                  notification_id = $2
                  AND user_id = $3
              `,
              [
                JSON.stringify(
                  ticket
                ),
                notificationId,
                device.user_id,
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
                status =
                  CASE
                    WHEN status = 'sent'
                    THEN status
                    ELSE 'failed'
                  END,
                error_message = $1
              WHERE
                notification_id = $2
                AND user_id = $3
            `,
            [
              String(error),
              notificationId,
              device.user_id,
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

      totalUsers:
        uniqueUsers.size,

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

    // ------------------------------------
    // CREATE NOTIFICATION RECORD
    // ------------------------------------

    const notification =
      await createNotification({
        title,
        body,
        notificationType:
          data.type || 'system',
        data,
        targetType: 'user',
      });


    // ------------------------------------
    // GET ACTIVE DEVICES FOR USER
    // ------------------------------------

    const result =
      await pool.query(
        `
          SELECT
            id,
            user_id,
            expo_push_token,
            platform
          FROM device_tokens
          WHERE user_id = $1
            AND is_active = TRUE
        `,
        [userId]
      );


    // ------------------------------------
    // CREATE DELIVERY EVEN IF USER HAS
    // NO ACTIVE PUSH DEVICE
    // ------------------------------------

    const firstDevice =
      result.rows.length
        ? result.rows[0]
        : null;

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
          $5
        )
        ON CONFLICT (
          notification_id,
          user_id
        )
        DO NOTHING
      `,
      [
        notification.id,
        userId,
        firstDevice?.id || null,
        firstDevice?.expo_push_token ||
          null,
        firstDevice
          ? 'pending'
          : 'no_device',
      ]
    );


    // ------------------------------------
    // NO ACTIVE DEVICE
    // Notification still appears in center
    // ------------------------------------

    if (!result.rows.length) {

      await pool.query(
        `
          UPDATE notifications
          SET
            status = 'sent',
            sent_at =
              CURRENT_TIMESTAMP,
            updated_at =
              CURRENT_TIMESTAMP
          WHERE id = $1
        `,
        [notification.id]
      );

      return {
        success: true,
        sent: 0,
        notificationId:
          notification.id,
        message:
          'Saved to notification center; no active push device',
      };
    }


    // ------------------------------------
    // BUILD PUSH MESSAGES
    // ------------------------------------

    const messages: ExpoPushMessage[] = [];

    const validDevices: any[] = [];

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

      validDevices.push(device);
    }


    // ------------------------------------
    // NO VALID EXPO TOKENS
    // Notification still stays in center
    // ------------------------------------

    if (!messages.length) {

      await pool.query(
        `
          UPDATE notification_deliveries
          SET status = 'no_device'
          WHERE notification_id = $1
            AND user_id = $2
        `,
        [
          notification.id,
          userId,
        ]
      );

      await pool.query(
        `
          UPDATE notifications
          SET
            status = 'sent',
            sent_at =
              CURRENT_TIMESTAMP,
            updated_at =
              CURRENT_TIMESTAMP
          WHERE id = $1
        `,
        [notification.id]
      );

      return {
        success: true,
        sent: 0,
        notificationId:
          notification.id,
        message:
          'Saved to notification center; no valid push token',
      };
    }


    // ------------------------------------
    // SEND PUSH
    // ------------------------------------

    const chunks =
      expo.chunkPushNotifications(
        messages
      );

    let sentCount = 0;

    let firstTicketId:
      string | null = null;

    let lastError:
      string | null = null;

    for (const chunk of chunks) {
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

            if (!firstTicketId) {
              firstTicketId =
                ticket.id;
            }
          } else {
            lastError =
              JSON.stringify(ticket);
          }
        }

      } catch (error) {

        console.error(
          'Expo user notification error:',
          error
        );

        lastError =
          String(error);
      }
    }


    // ------------------------------------
    // UPDATE USER DELIVERY
    // ------------------------------------

    await pool.query(
      `
        UPDATE notification_deliveries
        SET
          status = $1,
          expo_ticket_id = $2,
          error_message = $3,
          sent_at =
            CASE
              WHEN $4 > 0
              THEN CURRENT_TIMESTAMP
              ELSE sent_at
            END
        WHERE
          notification_id = $5
          AND user_id = $6
      `,
      [
        sentCount > 0
          ? 'sent'
          : 'failed',

        firstTicketId,

        lastError,

        sentCount,

        notification.id,

        userId,
      ]
    );


    // ------------------------------------
    // UPDATE NOTIFICATION STATUS
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

        notification.id,
      ]
    );


    return {
      success:
        sentCount > 0,

      sent:
        sentCount,

      notificationId:
        notification.id,
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