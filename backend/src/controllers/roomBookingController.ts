import { Request, Response } from 'express';
import { pool } from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const createRoomBooking = async (
  req: AuthRequest,
  res: Response
) => {
  const client = await pool.connect();

  try {
    const {
     
      room_id,
      check_in,
      check_out,
      number_of_guests,
      total_amount,
      special_requests,
    } = req.body;
    const userId = req.user?.userId;

if (!userId) {
  return res.status(401).json({
    success: false,
    message: 'Authentication required',
  });
}

    if ( !room_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: 'room_id, check_in and check_out are required',
      });
    }

    const bookingId = `ROOM-${Date.now()}`;

    const result = await client.query(
      `INSERT INTO room_bookings (
        booking_id,
        user_id,
        room_id,
        check_in,
        check_out,
        number_of_guests,
        total_amount,
        special_requests
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        bookingId,
        userId,
        room_id,
        check_in,
        check_out,
        number_of_guests || 1,
        total_amount || 0,
        special_requests || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Room booking created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error creating room booking:', error);

    if (error.code === '23P01') {
      return res.status(409).json({
        success: false,
        message: 'Room is already booked for the selected dates',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create room booking',
    });
  } finally {
    client.release();
  }
};

export const getRoomBooking = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const result = await pool.query(
      `SELECT
         rb.*,
         r.room_number,
         rt.name AS room_type_name,
         u.full_name,
         u.email,
         u.phone
       FROM room_bookings rb
       INNER JOIN rooms r
         ON rb.room_id = r.id
       INNER JOIN room_types rt
         ON r.room_type_id = rt.id
       INNER JOIN users u
         ON rb.user_id = u.id
       WHERE rb.booking_id = $1
         AND rb.user_id = $2`,
      [bookingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
  console.error(
    'Error checking room availability:',
    error
  );

  return res.status(500).json({
    success: false,
    message:
      error?.message ||
      'Failed to check room availability',
  });
  }
};
export const getUserRoomBookings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

if (!userId) {
  return res.status(401).json({
    success: false,
    message: 'Authentication required',
  });
}

    const result = await pool.query(
      `SELECT
         rb.id,
         rb.booking_id,
         rb.user_id,
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
         rb.created_at
       FROM room_bookings rb
       INNER JOIN rooms r
         ON rb.room_id = r.id
       INNER JOIN room_types rt
         ON r.room_type_id = rt.id
       WHERE rb.user_id = $1
       ORDER BY rb.created_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user bookings',
    });
  }
};
export const checkRoomAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const { roomId } = req.params;
    const { check_in, check_out } = req.query;

    if (!check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: 'check_in and check_out are required',
      });
    }

    const result = await pool.query(
      `SELECT EXISTS (
        SELECT 1
        FROM room_bookings
        WHERE room_id = $1
          AND booking_status IN ('pending', 'confirmed')
          AND daterange(check_in, check_out, '[)')
              && daterange($2::date, $3::date, '[)')
      ) AS is_booked`,
      [roomId, check_in, check_out]
    );

    return res.json({
      success: true,
      available: !result.rows[0].is_booked,
    });
  } catch (error) {
    console.error('Error checking room availability:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to check room availability',
    });
  }
};
export const getRoomBookingConfirmation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const result = await pool.query(
      `SELECT
         rb.booking_id,
         rb.user_id,
         rb.check_in,
         rb.check_out,
         rb.number_of_guests,
         rb.total_amount,
         rb.booking_status,
         rb.payment_status,
         rb.special_requests,
         r.room_number,
         rt.name AS room_type_name,
         u.full_name,
         u.email,
         u.phone
       FROM room_bookings rb
       INNER JOIN rooms r
         ON rb.room_id = r.id
       INNER JOIN room_types rt
         ON r.room_type_id = rt.id
       INNER JOIN users u
         ON rb.user_id = u.id
       WHERE rb.booking_id = $1
         AND rb.user_id = $2`,
      [bookingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const booking = result.rows[0];

    if (
      booking.booking_status !== 'confirmed' ||
      booking.payment_status !== 'paid'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Booking confirmation is not available yet',
      });
    }

    return res.json({
      success: true,
      data: {
        booking_id: booking.booking_id,
        booking_type: 'room',
        devotee: {
          full_name: booking.full_name,
          email: booking.email,
          phone: booking.phone,
        },
        room: {
          room_number: booking.room_number,
          room_type_name: booking.room_type_name,
        },
        check_in: booking.check_in,
        check_out: booking.check_out,
        number_of_guests: booking.number_of_guests,
        total_amount: booking.total_amount,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        special_requests: booking.special_requests,

        qr_code: booking.booking_id,
      },
    });
  } catch (error) {
    console.error(
      'Get room booking confirmation error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking confirmation',
    });
  }
};