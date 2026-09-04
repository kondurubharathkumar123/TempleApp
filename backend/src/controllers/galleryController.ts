import { Request, Response } from 'express';
import { pool } from '../db';

export const getGallery = async (
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
         category,
         is_active
       FROM gallery
       WHERE is_active = TRUE
       ORDER BY id DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery',
    });
  }
};