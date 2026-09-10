import { Request, Response } from 'express';
import { pool } from '../db';

const VALID_LABELS = ['live', 'watch'] as const;

type VideoLabel = (typeof VALID_LABELS)[number];

function normalizeLabel(value: unknown): VideoLabel {
  const label = String(value ?? '').trim().toLowerCase();

  if (!VALID_LABELS.includes(label as VideoLabel)) {
    throw new Error('Label must be either live or watch.');
  }

  return label as VideoLabel;
}

/**
 * GET /darshan-videos
 *
 * Public API used by the mobile application.
 * Only active videos are returned.
 */
export async function getDarshanVideos(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        label,
        url,
        thumbnail_url,
        is_active,
        created_at,
        updated_at
      FROM darshan_videos
      WHERE is_active = TRUE
      ORDER BY id DESC
    `);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get darshan videos error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load darshan videos.',
    });
  }
}

/**
 * GET /admin/darshan-videos
 *
 * Admin API.
 * Returns active and inactive videos.
 */
export async function getAdminDarshanVideos(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        label,
        url,
        thumbnail_url,
        is_active,
        created_at,
        updated_at
      FROM darshan_videos
      ORDER BY id DESC
    `);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Get admin darshan videos error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to load darshan videos.',
    });
  }
}

/**
 * POST /admin/darshan-videos
 */
export async function createDarshanVideo(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      description,
      label,
      url,
      thumbnail_url,
      is_active,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required.',
      });
    }

    if (!url?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'YouTube URL is required.',
      });
    }

    const normalizedLabel = normalizeLabel(label);

    const result = await pool.query(
      `
      INSERT INTO darshan_videos
      (
        title,
        description,
        label,
        url,
        thumbnail_url,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        title,
        description,
        label,
        url,
        thumbnail_url,
        is_active,
        created_at,
        updated_at
      `,
      [
        title.trim(),
        description?.trim() || null,
        normalizedLabel,
        url.trim(),
        thumbnail_url?.trim() || null,
        is_active !== false,
      ]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Create darshan video error:',
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create darshan video.',
    });
  }
}

/**
 * PUT /admin/darshan-videos/:id
 */
export async function updateDarshanVideo(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID.',
      });
    }

    const {
      title,
      description,
      label,
      url,
      thumbnail_url,
      is_active,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required.',
      });
    }

    if (!url?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'YouTube URL is required.',
      });
    }

    const normalizedLabel = normalizeLabel(label);

    const result = await pool.query(
      `
      UPDATE darshan_videos
      SET
        title = $1,
        description = $2,
        label = $3,
        url = $4,
        thumbnail_url = $5,
        is_active = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING
        id,
        title,
        description,
        label,
        url,
        thumbnail_url,
        is_active,
        created_at,
        updated_at
      `,
      [
        title.trim(),
        description?.trim() || null,
        normalizedLabel,
        url.trim(),
        thumbnail_url?.trim() || null,
        is_active !== false,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Darshan video not found.',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Update darshan video error:',
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update darshan video.',
    });
  }
}

/**
 * DELETE /admin/darshan-videos/:id
 *
 * Permanently deletes the video record.
 */
export async function deleteDarshanVideo(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID.',
      });
    }

    const result = await pool.query(
      `
      DELETE FROM darshan_videos
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Darshan video not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Darshan video deleted successfully.',
    });
  } catch (error) {
    console.error(
      'Delete darshan video error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to delete darshan video.',
    });
  }
}