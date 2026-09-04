import { Request, Response } from 'express';
import { pool } from '../db';

export const getEvents = async (
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
         event_date,
         start_time,
         end_time,
         location,
         is_active
       FROM events
       WHERE is_active = TRUE
         AND event_date >= CURRENT_DATE
       ORDER BY
         event_date ASC,
         start_time ASC,
         id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Get events error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
    });
  }
};