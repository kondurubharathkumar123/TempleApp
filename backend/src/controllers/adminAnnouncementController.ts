import { Request, Response } from 'express';
import { pool } from '../db';
import {
  createNotification,
  sendNotificationRecord,
} from '../services/notificationService';
// ========================================
// ADMIN: SEND ANNOUNCEMENT NOW
// ========================================

export async function sendAnnouncementNow(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const announcementId = Number(id);

    if (
      !Number.isInteger(announcementId) ||
      announcementId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID',
      });
    }

    const announcementResult = await pool.query(
      `
      SELECT
        id,
        title,
        message,
        image_url,
        is_active
      FROM announcements
      WHERE id = $1
      LIMIT 1
      `,
      [announcementId]
    );

    if (!announcementResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const announcement = announcementResult.rows[0];

    if (!announcement.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Announcement is inactive',
      });
    }

    // Create notification record
    const notification = await createNotification({
      title: announcement.title,
      body: announcement.message,
      notificationType: 'announcement',
      data: {
        type: 'announcement',
        announcementId: announcement.id,
        screen: 'announcements',
        imageUrl: announcement.image_url || null,
      },
      targetType: 'all',
    });

    // Send immediately
    await sendNotificationRecord(notification.id);

    // Mark announcement as published now
    await pool.query(
      `
      UPDATE announcements
      SET
        publish_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [announcementId]
    );

    return res.status(200).json({
      success: true,
      message: 'Announcement sent successfully',
      data: {
        announcementId: announcement.id,
        notificationId: notification.id,
      },
    });
  } catch (error) {
    console.error(
      'Admin send announcement error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to send announcement',
    });
  }
}


// ========================================
// ADMIN: SCHEDULE ANNOUNCEMENT
// ========================================

export async function scheduleAnnouncement(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { publish_at } = req.body;

    const announcementId = Number(id);

    if (
      !Number.isInteger(announcementId) ||
      announcementId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID',
      });
    }

    if (!publish_at) {
      return res.status(400).json({
        success: false,
        message: 'publish_at is required',
      });
    }

    const scheduledTime = new Date(publish_at);

    if (Number.isNaN(scheduledTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid publish_at date',
      });
    }

    if (scheduledTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future',
      });
    }

    const announcementResult = await pool.query(
      `
      SELECT
        id,
        title,
        message,
        image_url,
        is_active
      FROM announcements
      WHERE id = $1
      LIMIT 1
      `,
      [announcementId]
    );

    if (!announcementResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const announcement = announcementResult.rows[0];

    if (!announcement.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Announcement is inactive',
      });
    }

    // Save scheduled time in announcements
    await pool.query(
      `
      UPDATE announcements
      SET
        publish_at = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [scheduledTime, announcementId]
    );

    // Create scheduled notification
    const notification = await createNotification({
      title: announcement.title,
      body: announcement.message,
      notificationType: 'announcement',
      data: {
        type: 'announcement',
        announcementId: announcement.id,
        screen: 'announcements',
        imageUrl: announcement.image_url || null,
      },
      targetType: 'all',
      scheduledAt: scheduledTime,
    });

    return res.status(200).json({
      success: true,
      message: 'Announcement scheduled successfully',
      data: {
        announcementId: announcement.id,
        notificationId: notification.id,
        scheduledAt: scheduledTime,
      },
    });
  } catch (error) {
    console.error(
      'Admin schedule announcement error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to schedule announcement',
    });
  }
}

// ========================================
// ADMIN: GET ALL ANNOUNCEMENTS
// ========================================

export async function getAllAdminAnnouncements(
  req: Request,
  res: Response
) {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at,
        created_at,
        updated_at
      FROM announcements
      ORDER BY
        COALESCE(publish_at, created_at) DESC,
        id DESC
      `
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Admin get announcements error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to load announcements',
    });
  }
}
// ========================================
// ADMIN: CREATE ANNOUNCEMENT
// ========================================

export async function createAnnouncement(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      message,
      image_url,
      publish_at,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      typeof title !== 'string' ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (
      !message ||
      typeof message !== 'string' ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Create announcement
    const result = await pool.query(
      `
      INSERT INTO announcements (
        title,
        message,
        image_url,
        is_active,
        publish_at
      )
      VALUES ($1, $2, $3, TRUE, $4)
      RETURNING
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at,
        created_at,
        updated_at
      `,
      [
        title.trim(),
        message.trim(),
        image_url || null,
        publish_at || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Admin create announcement error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
    });
  }
}// ========================================
// ADMIN: UPDATE ANNOUNCEMENT
// ========================================

export async function updateAnnouncement(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const announcementId = Number(id);

    if (
      !Number.isInteger(announcementId) ||
      announcementId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID',
      });
    }

    const {
      title,
      message,
      image_url,
      publish_at,
    } = req.body;

    if (
      !title ||
      typeof title !== 'string' ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (
      !message ||
      typeof message !== 'string' ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const result = await pool.query(
      `
      UPDATE announcements
      SET
        title = $1,
        message = $2,
        image_url = $3,
        publish_at = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at,
        created_at,
        updated_at
      `,
      [
        title.trim(),
        message.trim(),
        image_url || null,
        publish_at || null,
        announcementId,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Admin update announcement error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update announcement',
    });
  }
}
// ========================================
// ADMIN: TOGGLE ANNOUNCEMENT STATUS
// ========================================

export async function toggleAnnouncementStatus(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const announcementId = Number(id);

    if (
      !Number.isInteger(announcementId) ||
      announcementId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID',
      });
    }

    const result = await pool.query(
      `
      UPDATE announcements
      SET
        is_active = NOT is_active,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at,
        created_at,
        updated_at
      `,
      [announcementId]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: result.rows[0].is_active
        ? 'Announcement activated successfully'
        : 'Announcement deactivated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Admin toggle announcement status error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update announcement status',
    });
  }
}