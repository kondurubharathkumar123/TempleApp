import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { pool } from '../db';

/* =========================================================
   GET ALL DARSHAN SLOTS
========================================================= */

export const getAllDarshanSlots = async (
  req: AuthRequest,
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
         is_active,
         created_at,
         updated_at
       FROM darshan_slots
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
      'Get all darshan slots error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Darshan slots',
    });
  }
};

/* =========================================================
   CREATE DARSHAN SLOT
========================================================= */

export const createDarshanSlot = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      name,
      description,
      darshan_date,
      start_time,
      end_time,
      price,
      capacity,
      is_active,
    } = req.body;

    if (
      !name ||
      !darshan_date ||
      !start_time ||
      !end_time ||
      price === undefined ||
      capacity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Name, date, start time, end time, price and capacity are required',
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    if (Number(capacity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be greater than 0',
      });
    }

    if (end_time <= start_time) {
      return res.status(400).json({
        success: false,
        message:
          'End time must be later than start time',
      });
    }

    const result = await pool.query(
      `INSERT INTO darshan_slots (
         name,
         description,
         darshan_date,
         start_time,
         end_time,
         price,
         capacity,
         is_active
       )
       VALUES (
         $1,
         $2,
         $3,
         $4,
         $5,
         $6,
         $7,
         $8
       )
       RETURNING
         id,
         name,
         description,
         darshan_date,
         start_time,
         end_time,
         price,
         capacity,
         is_active,
         created_at,
         updated_at`,
      [
        name.trim(),
        description || null,
        darshan_date,
        start_time,
        end_time,
        Number(price),
        Number(capacity),
        is_active !== undefined
          ? Boolean(is_active)
          : true,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Darshan slot created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Create Darshan slot error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to create Darshan slot',
    });
  }
};

/* =========================================================
   UPDATE DARSHAN SLOT
========================================================= */

export const updateDarshanSlot = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      darshan_date,
      start_time,
      end_time,
      price,
      capacity,
      is_active,
    } = req.body;

    if (
      !name ||
      !darshan_date ||
      !start_time ||
      !end_time ||
      price === undefined ||
      capacity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Name, date, start time, end time, price and capacity are required',
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    if (Number(capacity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be greater than 0',
      });
    }

    if (end_time <= start_time) {
      return res.status(400).json({
        success: false,
        message:
          'End time must be later than start time',
      });
    }

    const result = await pool.query(
      `UPDATE darshan_slots
       SET
         name = $1,
         description = $2,
         darshan_date = $3,
         start_time = $4,
         end_time = $5,
         price = $6,
         capacity = $7,
         is_active = $8,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING
         id,
         name,
         description,
         darshan_date,
         start_time,
         end_time,
         price,
         capacity,
         is_active,
         created_at,
         updated_at`,
      [
        name.trim(),
        description || null,
        darshan_date,
        start_time,
        end_time,
        Number(price),
        Number(capacity),
        is_active !== undefined
          ? Boolean(is_active)
          : true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Darshan slot not found',
      });
    }

    return res.json({
      success: true,
      message: 'Darshan slot updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Update Darshan slot error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update Darshan slot',
    });
  }
};

/* =========================================================
   UPDATE DARSHAN ACTIVE STATUS
========================================================= */

export const updateDarshanSlotStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'is_active must be true or false',
      });
    }

    const result = await pool.query(
      `UPDATE darshan_slots
       SET
         is_active = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING
         id,
         name,
         description,
         darshan_date,
         start_time,
         end_time,
         price,
         capacity,
         is_active,
         created_at,
         updated_at`,
      [
        is_active,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Darshan slot not found',
      });
    }

    return res.json({
      success: true,
      message:
        'Darshan slot status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Update Darshan slot status error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update Darshan slot status',
    });
  }
};