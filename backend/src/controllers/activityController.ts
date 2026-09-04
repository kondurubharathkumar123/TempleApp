import { Request, Response } from 'express';
import { pool } from '../db';

export const getActivities = async (
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
         is_active
       FROM activities
       WHERE is_active = TRUE
       ORDER BY activity_date ASC NULLS LAST, id ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
    });
  }
};

export const getActivityById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         id,
         title,
         description,
         image_url,
         activity_date,
         location,
         is_active
       FROM activities
       WHERE id = $1
         AND is_active = TRUE`,
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
    console.error('Error fetching activity:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
    });
  }
};