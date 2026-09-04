import { Request, Response } from 'express';
import { pool } from '../db';

export const getPublications = async (
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
         author,
         publication_date,
         document_url,
         is_active
       FROM publications
       WHERE is_active = TRUE
       ORDER BY publication_date DESC NULLS LAST, id DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching publications:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch publications',
    });
  }
};