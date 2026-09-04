import { Request, Response } from 'express';
import { pool } from '../db';

export const getBuildings = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         code,
         description,
         is_active,
         created_at,
         updated_at
       FROM buildings
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching buildings:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch buildings',
    });
  }
};

export const createBuilding = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      code,
      description,
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'name and code are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO buildings (
         name,
         code,
         description
       )
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        name.trim(),
        code.trim().toUpperCase(),
        description?.trim() || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Building created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error creating building:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Building name or code already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create building',
    });
  }
};

export const updateBuilding = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      code,
      description,
      is_active,
    } = req.body;

    const result = await pool.query(
      `UPDATE buildings
       SET
         name = COALESCE($1, name),
         code = COALESCE($2, code),
         description = COALESCE($3, description),
         is_active = COALESCE($4, is_active),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [
        name?.trim() || null,
        code?.trim()?.toUpperCase() || null,
        description?.trim() || null,
        is_active ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Building not found',
      });
    }

    return res.json({
      success: true,
      message: 'Building updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating building:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Building name or code already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update building',
    });
  }
};

export const deleteBuilding = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE buildings
       SET
         is_active = FALSE,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Building not found',
      });
    }

    return res.json({
      success: true,
      message: 'Building deactivated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting building:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete building',
    });
  }
};