import { Request, Response } from 'express';
import { pool } from '../db';

export const getSevaCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, is_active
       FROM seva_categories
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching seva categories:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch seva categories',
    });
  }
};

export const getSevas = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         s.id,
         s.name,
         s.description,
         s.amount,
         s.image_url,
         s.category_id,
         sc.name AS category_name
       FROM sevas s
       LEFT JOIN seva_categories sc
         ON s.category_id = sc.id
       WHERE s.is_active = TRUE
       ORDER BY s.id ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching sevas:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch sevas',
    });
  }
};