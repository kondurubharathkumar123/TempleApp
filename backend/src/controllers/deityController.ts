import { Request, Response } from 'express';
import { pool } from '../db';

export const getDeities = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         description,
         image_url,
         significance,
         devotional,
         is_active
       FROM deities
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching deities:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch deities',
    });
  }
};
export const getDeityById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         id,
         name,
         description,
         image_url,
         significance,
         devotional,
         is_active
       FROM deities
       WHERE id = $1
         AND is_active = TRUE`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Deity not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching deity:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch deity',
    });
  }
};