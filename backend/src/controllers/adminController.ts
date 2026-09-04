import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { pool } from '../db';

/* =========================================================
   DASHBOARD
========================================================= */

export const getDashboardSummary = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const usersResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM users
       WHERE role = 'devotee'`
    );

    const roomsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM rooms
       WHERE is_active = TRUE`
    );

    const pendingRoomBookingsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM room_bookings
       WHERE booking_status = 'pending'`
    );

    const confirmedRoomBookingsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM room_bookings
       WHERE booking_status = 'confirmed'`
    );

    const pendingServiceBookingsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM service_bookings
       WHERE booking_status = 'pending'`
    );

    const confirmedServiceBookingsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM service_bookings
       WHERE booking_status = 'confirmed'`
    );

    return res.json({
      success: true,
      data: {
        total_devotees: usersResult.rows[0].count,
        total_rooms: roomsResult.rows[0].count,
        pending_room_bookings:
          pendingRoomBookingsResult.rows[0].count,
        confirmed_room_bookings:
          confirmedRoomBookingsResult.rows[0].count,
        pending_service_bookings:
          pendingServiceBookingsResult.rows[0].count,
        confirmed_service_bookings:
          confirmedServiceBookingsResult.rows[0].count,
      },
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
    });
  }
};

/* =========================================================
   USERS
========================================================= */

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         phone,
         role,
         created_at,
         updated_at
       FROM users
       ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all users error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         phone,
         role,
         created_at,
         updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get user by ID error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      email,
      phone,
      role,
    } = req.body;

    if (!full_name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email and role are required',
      });
    }

    const allowedRoles = [
      'devotee',
      'admin',
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET
         full_name = $1,
         email = $2,
         phone = $3,
         role = $4,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING
         id,
         full_name,
         email,
         phone,
         role,
         created_at,
         updated_at`,
      [
        full_name,
        email,
        phone || null,
        role,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Update user error:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Email or phone already registered',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
};

/* =========================================================
   ROOM BOOKINGS
========================================================= */

export const getAllRoomBookings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         rb.id,
         rb.booking_id,
         rb.user_id,
         u.full_name,
         u.email,
         u.phone,
         rb.room_id,
         r.room_number,
         rt.name AS room_type_name,
         rb.check_in,
         rb.check_out,
         rb.number_of_guests,
         rb.total_amount,
         rb.booking_status,
         rb.payment_status,
         rb.special_requests,
         rb.created_at,
         rb.updated_at
       FROM room_bookings rb

       INNER JOIN users u
         ON rb.user_id = u.id

       INNER JOIN rooms r
         ON rb.room_id = r.id

       INNER JOIN room_types rt
         ON r.room_type_id = rt.id

       ORDER BY rb.created_at DESC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Get all room bookings error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch room bookings',
    });
  }
};

export const updateRoomBookingStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { booking_status } = req.body;

    const allowedStatuses = [
      'pending',
      'confirmed',
      'cancelled',
    ];

    if (!allowedStatuses.includes(booking_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      });
    }

    const result = await pool.query(
      `UPDATE room_bookings
       SET
         booking_status = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING
         id,
         booking_id,
         user_id,
         room_id,
         check_in,
         check_out,
         number_of_guests,
         total_amount,
         booking_status,
         payment_status,
         special_requests,
         created_at,
         updated_at`,
      [
        booking_status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    return res.json({
      success: true,
      message:
        'Room booking status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Update room booking status error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update room booking status',
    });
  }
};

export const updateRoomPaymentStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const allowedStatuses = [
      'pending',
      'paid',
      'failed',
      'refunded',
    ];

    if (
      !payment_status ||
      !allowedStatuses.includes(payment_status)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const result = await pool.query(
      `UPDATE room_bookings
       SET
         payment_status = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING
         id,
         booking_id,
         user_id,
         room_id,
         check_in,
         check_out,
         number_of_guests,
         total_amount,
         booking_status,
         payment_status,
         special_requests,
         created_at,
         updated_at`,
      [
        payment_status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    return res.json({
      success: true,
      message:
        'Room payment status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Update room payment status error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update room payment status',
    });
  }
};

/* =========================================================
   SERVICE BOOKINGS
========================================================= */

export const getAllServiceBookings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         sb.id,
         sb.booking_id,
         sb.user_id,
         u.full_name,
         u.email,
         u.phone,
         sb.service_type,
         sb.booking_date,
         sb.booking_time,
         sb.number_of_devotees,
         sb.total_amount,
         sb.booking_status,
         sb.payment_status,
         sb.special_requests,
         sb.created_at,
         sb.updated_at
       FROM service_bookings sb

       INNER JOIN users u
         ON sb.user_id = u.id

       ORDER BY sb.created_at DESC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Get all service bookings error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service bookings',
    });
  }
};

export const updateServiceBookingStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { booking_status } = req.body;

    const allowedStatuses = [
      'pending',
      'confirmed',
      'cancelled',
    ];

    if (!allowedStatuses.includes(booking_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      });
    }

    const result = await pool.query(
      `UPDATE service_bookings
       SET
         booking_status = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING
         id,
         booking_id,
         user_id,
         service_type,
         booking_date,
         booking_time,
         number_of_devotees,
         total_amount,
         booking_status,
         payment_status,
         special_requests,
         created_at,
         updated_at`,
      [
        booking_status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service booking not found',
      });
    }

    return res.json({
      success: true,
      message:
        'Service booking status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Update service booking status error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update service booking status',
    });
  }
};

export const updateServicePaymentStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const allowedStatuses = [
      'pending',
      'paid',
      'failed',
      'refunded',
    ];

    if (
      !payment_status ||
      !allowedStatuses.includes(payment_status)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const result = await pool.query(
      `UPDATE service_bookings
       SET
         payment_status = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING
         id,
         booking_id,
         user_id,
         service_type,
         booking_date,
         booking_time,
         number_of_devotees,
         total_amount,
         booking_status,
         payment_status,
         special_requests,
         created_at,
         updated_at`,
      [
        payment_status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service booking not found',
      });
    }

    return res.json({
      success: true,
      message:
        'Service payment status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Update service payment status error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update service payment status',
    });
  }
};

/* =========================================================
   ROOMS
========================================================= */

/*
  GET ALL ROOMS FOR ADMIN

  Important:
  Room information comes from:
    rooms
    room_types

  This keeps Rooms and Room Types properly separated.
*/

export const getAllRooms = async (
  req: AuthRequest,
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
         r.is_active,
         r.room_type_id,
         r.building_id,

         b.name AS building_name,
         b.code AS building_code,

         rt.name AS room_type_name,
         rt.description AS room_type_description,
         rt.capacity,
         rt.price_per_night,

         r.created_at,
         r.updated_at

       FROM rooms r

       INNER JOIN buildings b
         ON r.building_id = b.id

       INNER JOIN room_types rt
         ON r.room_type_id = rt.id

       ORDER BY
         b.id ASC,
         r.floor ASC,
         r.room_number ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all rooms error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
    });
  }
};


/*
  CREATE ROOM

  Expected frontend body:

  {
    "room_number": "103",
    "room_type_id": 1,
    "status": "available"
  }
*/
export const createRoom = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      room_number,
      room_type_id,
      building_id,
      status,
    } = req.body;

    if (!room_number || !room_type_id || !building_id) {
      return res.status(400).json({
        success: false,
        message:
          'Room number, room type and building are required',
      });
    }

    const roomTypeResult = await pool.query(
      `SELECT id
       FROM room_types
       WHERE id = $1
         AND is_active = TRUE`,
      [room_type_id]
    );

    if (roomTypeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found',
      });
    }

    const buildingResult = await pool.query(
      `SELECT id
       FROM buildings
       WHERE id = $1
         AND is_active = TRUE`,
      [building_id]
    );

    if (buildingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Building not found',
      });
    }

    const allowedStatuses = [
      'available',
      'maintenance',
      'unavailable',
    ];

    const roomStatus = status || 'available';

    if (!allowedStatuses.includes(roomStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room status',
      });
    }

    const result = await pool.query(
      `INSERT INTO rooms (
         room_number,
         room_type_id,
         building_id,
         status
       )
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         room_number,
         room_type_id,
         building_id,
         status,
         created_at,
         updated_at`,
      [
        room_number,
        room_type_id,
        building_id,
        roomStatus,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Create room error:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Room number already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create room',
    });
  }
};


/*
  UPDATE ROOM
*/
export const updateRoom = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      room_number,
      room_type_id,
      building_id,
      status,
    } = req.body;

    if (!room_number || !room_type_id || !building_id) {
      return res.status(400).json({
        success: false,
        message:
          'Room number, room type and building are required',
      });
    }

    const allowedStatuses = [
      'available',
      'maintenance',
      'unavailable',
    ];

    const roomStatus = status || 'available';

    if (!allowedStatuses.includes(roomStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room status',
      });
    }

    const roomTypeResult = await pool.query(
      `SELECT id
       FROM room_types
       WHERE id = $1
         AND is_active = TRUE`,
      [room_type_id]
    );

    if (roomTypeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found',
      });
    }

    const buildingResult = await pool.query(
      `SELECT id
       FROM buildings
       WHERE id = $1
         AND is_active = TRUE`,
      [building_id]
    );

    if (buildingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Building not found',
      });
    }

    const result = await pool.query(
      `UPDATE rooms
       SET
         room_number = $1,
         room_type_id = $2,
         building_id = $3,
         status = $4,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING
         id,
         room_number,
         room_type_id,
         building_id,
         status,
         created_at,
         updated_at`,
      [
        room_number,
        room_type_id,
        building_id,
        roomStatus,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    return res.json({
      success: true,
      message: 'Room updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Update room error:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Room number already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update room',
    });
  }
};

/*
  UPDATE ROOM STATUS
*/

export const updateRoomStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'available',
      'maintenance',
      'unavailable',
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room status',
      });
    }

    const result = await pool.query(
      `UPDATE rooms
       SET
         status = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2

       RETURNING
         id,
         room_number,
         room_type_id,
         status,
         is_active,
         created_at,
         updated_at`,
      [
        status,
        id,
      ]
    );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    return res.json({
      success: true,
      message:
        'Room status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Update room status error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update room status',
    });
  }
};


/*
  DEACTIVATE ROOM

  We do not physically delete the room.
  This preserves booking history.
*/

export const deactivateRoom = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE rooms
       SET
         is_active = FALSE,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1

       RETURNING
         id,
         room_number,
         room_type_id,
         status,
         is_active,
         created_at,
         updated_at`,
      [id]
    );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    return res.json({
      success: true,
      message:
        'Room deactivated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Deactivate room error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to deactivate room',
    });
  }
};


/* =========================================================
   ROOM TYPES
========================================================= */

export const getAllRoomTypes = async (
  req: AuthRequest,
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
         is_active,
         created_at,
         updated_at
       FROM room_types
       ORDER BY id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Get all room types error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch room types',
    });
  }
};

export const createRoomType = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      name,
      description,
      capacity,
      price_per_night,
      image_url,
    } = req.body;

    if (
      !name ||
      capacity === undefined ||
      price_per_night === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Name, capacity and price per night are required',
      });
    }

    if (Number(capacity) <= 0) {
      return res.status(400).json({
        success: false,
        message:
          'Capacity must be greater than 0',
      });
    }

    if (Number(price_per_night) < 0) {
      return res.status(400).json({
        success: false,
        message:
          'Price per night cannot be negative',
      });
    }

    const result = await pool.query(
      `INSERT INTO room_types (
         name,
         description,
         capacity,
         price_per_night,
         image_url,
         is_active
       )
       VALUES (
         $1,
         $2,
         $3,
         $4,
         $5,
         TRUE
       )

       RETURNING
         id,
         name,
         description,
         capacity,
         price_per_night,
         image_url,
         is_active,
         created_at,
         updated_at`,
      [
        name.trim(),
        description || null,
        Number(capacity),
        Number(price_per_night),
        image_url || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        'Room type created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error(
      'Create room type error:',
      error
    );

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message:
          'Room type already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to create room type',
    });
  }
};

export const updateRoomType = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      capacity,
      price_per_night,
      image_url,
    } = req.body;

    if (
      !name ||
      capacity === undefined ||
      price_per_night === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Name, capacity and price per night are required',
      });
    }

    if (Number(capacity) <= 0) {
      return res.status(400).json({
        success: false,
        message:
          'Capacity must be greater than 0',
      });
    }

    if (Number(price_per_night) < 0) {
      return res.status(400).json({
        success: false,
        message:
          'Price per night cannot be negative',
      });
    }

    const result = await pool.query(
      `UPDATE room_types
       SET
         name = $1,
         description = $2,
         capacity = $3,
         price_per_night = $4,
         image_url = $5,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $6

       RETURNING
         id,
         name,
         description,
         capacity,
         price_per_night,
         image_url,
         is_active,
         created_at,
         updated_at`,
      [
        name.trim(),
        description || null,
        Number(capacity),
        Number(price_per_night),
        image_url || null,
        id,
      ]
    );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          'Room type not found',
      });
    }

    return res.json({
      success: true,
      message:
        'Room type updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error(
      'Update room type error:',
      error
    );

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message:
          'Room type already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to update room type',
    });
  }
};
export const getAllBuildings = async (
  req: AuthRequest,
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
         created_at
       FROM buildings
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all buildings error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch buildings',
    });
  }
};
/* =========================================================
   EVENTS
========================================================= */

export const getAllEvents = async (
  req: AuthRequest,
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
         is_active,
         created_at,
         updated_at
       FROM events
       ORDER BY
         event_date ASC NULLS LAST,
         start_time ASC NULLS LAST,
         id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all events error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
    });
  }
};


export const createEvent = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      image_url,
      event_date,
      start_time,
      end_time,
      location,
    } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({
        success: false,
        message: 'Title and event date are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO events (
         title,
         description,
         image_url,
         event_date,
         start_time,
         end_time,
         location,
         is_active
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
       RETURNING
         id,
         title,
         description,
         image_url,
         event_date,
         start_time,
         end_time,
         location,
         is_active,
         created_at,
         updated_at`,
      [
        title.trim(),
        description || null,
        image_url || null,
        event_date,
        start_time || null,
        end_time || null,
        location || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create event error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create event',
    });
  }
};


export const updateEvent = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      image_url,
      event_date,
      start_time,
      end_time,
      location,
    } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({
        success: false,
        message: 'Title and event date are required',
      });
    }

    const result = await pool.query(
      `UPDATE events
       SET
         title = $1,
         description = $2,
         image_url = $3,
         event_date = $4,
         start_time = $5,
         end_time = $6,
         location = $7,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING
         id,
         title,
         description,
         image_url,
         event_date,
         start_time,
         end_time,
         location,
         is_active,
         created_at,
         updated_at`,
      [
        title.trim(),
        description || null,
        image_url || null,
        event_date,
        start_time || null,
        end_time || null,
        location || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.json({
      success: true,
      message: 'Event updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update event error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update event',
    });
  }
};


export const updateEventStatus = async (
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
      `UPDATE events
       SET
         is_active = $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING
         id,
         title,
         description,
         image_url,
         event_date,
         start_time,
         end_time,
         location,
         is_active,
         created_at,
         updated_at`,
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.json({
      success: true,
      message: 'Event status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update event status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update event status',
    });
  }
};