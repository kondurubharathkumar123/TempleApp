import { Request, Response } from 'express';
import { pool } from '../db';

export const getAdminActivities = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         title,
         description,
         image_url,
         activity_date,
         location,
         is_active,
         created_at,
         updated_at
       FROM activities
       ORDER BY activity_date ASC NULLS LAST, id ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching admin activities:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
    });
  }
};

export const createActivity = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      image_url,
      activity_date,
      location,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Activity title is required',
      });
    }

    const result = await pool.query(
      `INSERT INTO activities
       (
         title,
         description,
         image_url,
         activity_date,
         location,
         is_active
       )
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING
         id,
         title,
         description,
         image_url,
         activity_date,
         location,
         is_active,
         created_at,
         updated_at`,
      [
        title.trim(),
        description || null,
        image_url || null,
        activity_date || null,
        location || null,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating activity:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
    });
  }
};

export const updateActivity = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      image_url,
      activity_date,
      location,
      is_active,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Activity title is required',
      });
    }

    const result = await pool.query(
      `UPDATE activities
       SET
         title = $1,
         description = $2,
         image_url = $3,
         activity_date = $4,
         location = $5,
         is_active = $6,
         updated_at = NOW()
       WHERE id = $7
       RETURNING
         id,
         title,
         description,
         image_url,
         activity_date,
         location,
         is_active,
         created_at,
         updated_at`,
      [
        title.trim(),
        description || null,
        image_url || null,
        activity_date || null,
        location || null,
        typeof is_active === 'boolean'
          ? is_active
          : true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating activity:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
    });
  }
};

export const deactivateActivity = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE activities
       SET
         is_active = FALSE,
         updated_at = NOW()
       WHERE id = $1
       RETURNING
         id,
         title,
         description,
         image_url,
         activity_date,
         location,
         is_active,
         created_at,
         updated_at`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error deactivating activity:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to deactivate activity',
    });
  }
};