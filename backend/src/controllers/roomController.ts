import { Request, Response } from 'express';
import { pool } from '../db';

export const getRoomTypes = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         description,
         capacity,
         price_per_night,
         image_url,
         is_active
       FROM room_types
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );

    res.json({
      success: true,        
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching room types:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch room types',
    });
  }
};

export const getRooms = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         r.id,
         r.room_number,
         r.floor,
         r.status,
         r.description,
         r.image_url,
         r.room_type_id,

         b.id AS building_id,
         b.name AS building_name,
         b.code AS building_code,

         rt.name AS room_type_name,
         rt.capacity,
         rt.price_per_night

       FROM rooms r

       INNER JOIN buildings b
         ON r.building_id = b.id

       INNER JOIN room_types rt
         ON r.room_type_id = rt.id

       WHERE r.is_active = TRUE

       ORDER BY
         b.id ASC,
         r.floor ASC,
         r.room_number ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
    });
  }
};