import { pool } from '../db';
import {
  sendNotificationRecord,
} from './notificationService';

let schedulerRunning = false;


// ========================================
// PROCESS SCHEDULED NOTIFICATIONS
// ========================================

export async function processScheduledNotifications() {

  if (schedulerRunning) {
    return;
  }

  schedulerRunning = true;

  try {

    const result = await pool.query(`
      SELECT
        id
      FROM notifications
      WHERE status = 'scheduled'
        AND scheduled_at IS NOT NULL
        AND scheduled_at <= CURRENT_TIMESTAMP
      ORDER BY scheduled_at ASC
      LIMIT 20
    `);


    for (
      const notification
      of result.rows
    ) {

      try {

        // --------------------------------
        // LOCK NOTIFICATION
        // --------------------------------

        const lockResult =
          await pool.query(
            `
            UPDATE notifications
            SET
              status = 'processing',
              updated_at =
                CURRENT_TIMESTAMP
            WHERE id = $1
              AND status = 'scheduled'
            RETURNING id
            `,
            [notification.id]
          );


        // Already picked up by another
        // scheduler cycle.
        if (
          !lockResult.rows.length
        ) {
          continue;
        }


        // --------------------------------
        // SEND EXISTING RECORD
        // --------------------------------

        await sendNotificationRecord(
          notification.id
        );

      } catch (error) {

        console.error(
          `Scheduled notification ${notification.id} failed:`,
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
          [notification.id]
        );
      }
    }

  } catch (error) {

    console.error(
      'Scheduled notification processor error:',
      error
    );

  } finally {

    schedulerRunning = false;

  }
}