import { Request, Response } from 'express';
import { pool } from '../db';

// ========================================
// GET ALL PUBLISHED ANNOUNCEMENTS
// ========================================

export async function getAnnouncements(
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
      WHERE is_active = TRUE
        AND (
          publish_at IS NULL
          OR publish_at <= CURRENT_TIMESTAMP
        )
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
      'Get announcements error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to load announcements',
    });
  }
}

// ========================================
// GET SINGLE ANNOUNCEMENT
// ========================================

export async function getAnnouncementById(
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
      WHERE id = $1
        AND is_active = TRUE
        AND (
          publish_at IS NULL
          OR publish_at <= CURRENT_TIMESTAMP
        )
      LIMIT 1
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
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Get announcement by ID error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to load announcement',
    });
  }
}