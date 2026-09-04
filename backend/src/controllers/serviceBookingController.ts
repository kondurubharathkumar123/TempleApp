import { Request, Response } from 'express';
import { pool } from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const createServiceBooking = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
    
      service_type,
      booking_date,
      booking_time,
      number_of_devotees,
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

    if (
      
      !service_type ||
      !booking_date ||
      !booking_time
    ) {
      return res.status(400).json({
        success: false,
        message:
          'user_id, service_type, booking_date and booking_time are required',
      });
    }

    if (!['Darshan', 'Pooja'].includes(service_type)) {
      return res.status(400).json({
        success: false,
        message: 'service_type must be Darshan or Pooja',
      });
    }

    const bookingId = `SERVICE-${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO service_bookings (
        booking_id,
        user_id,
        service_type,
        booking_date,
        booking_time,
        number_of_devotees,
        total_amount,
        special_requests
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        bookingId,
  userId,
  service_type,
        booking_date,
        booking_time,
        number_of_devotees || 1,
        total_amount || 0,
        special_requests || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Service booking created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating service booking:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create service booking',
    });
  }
};

export const getServiceBooking = async (
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
         sb.*,
         u.full_name,
         u.email,
         u.phone
       FROM service_bookings sb
       INNER JOIN users u
         ON sb.user_id = u.id
       WHERE sb.booking_id = $1
         AND sb.user_id = $2`,
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
  } catch (error) {
    console.error('Error fetching service booking:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service booking',
    });
  }
};

export const getUserServiceBookings = async (
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
         id,
         booking_id,
         service_type,
         booking_date,
         booking_time,
         number_of_devotees,
         total_amount,
         booking_status,
         payment_status,
         special_requests,
         created_at
       FROM service_bookings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching user service bookings:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user service bookings',
    });
  }
};
export const getServiceBookingConfirmation = async (
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
         sb.booking_id,
         sb.user_id,
         sb.service_type,
         sb.booking_date,
         sb.booking_time,
         sb.number_of_devotees,
         sb.total_amount,
         sb.booking_status,
         sb.payment_status,
         sb.special_requests,
         u.full_name,
         u.email,
         u.phone
       FROM service_bookings sb
       INNER JOIN users u
         ON sb.user_id = u.id
       WHERE sb.booking_id = $1
         AND sb.user_id = $2`,
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
        booking_type: 'service',

        devotee: {
          full_name: booking.full_name,
          email: booking.email,
          phone: booking.phone,
        },

        service: {
          service_type: booking.service_type,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          number_of_devotees: booking.number_of_devotees,
        },

        total_amount: booking.total_amount,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        special_requests: booking.special_requests,

        qr_code: booking.booking_id,
      },
    });
  } catch (error) {
    console.error(
      'Get service booking confirmation error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking confirmation',
    });
  }
};
export const completeServiceBookingPayment = async (
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
      `UPDATE service_bookings
       SET
         payment_status = 'paid',
         booking_status = 'confirmed'
       WHERE booking_id = $1
         AND user_id = $2
       RETURNING *`,
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
      message: 'Payment completed successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Complete service booking payment error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to complete payment',
    });
  }
};