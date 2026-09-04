import { Request, Response } from 'express';
import { pool } from '../db';
export const getDarshanSlots = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         description,
         darshan_date,
         start_time,
         end_time,
         price,
         capacity,
         is_active
       FROM darshan_slots
       WHERE is_active = TRUE
         AND darshan_date = CURRENT_DATE
       ORDER BY
         start_time ASC,
         id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Get Darshan slots error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s Darshan slots',
    });
  }
};
export const getAllActiveDarshanSlots = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         description,
         darshan_date,
         start_time,
         end_time,
         price,
         capacity,
         is_active
       FROM darshan_slots
       WHERE is_active = TRUE
       ORDER BY
         darshan_date ASC,
         start_time ASC,
         id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Get all Darshan slots error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Darshan slots',
    });
  }
};