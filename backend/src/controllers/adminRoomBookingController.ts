import { Request, Response } from 'express';
import { pool } from '../db';

/*
 * Get all room bookings for admin
 *
 * GET /api/admin/room-bookings
 */
export const getAllRoomBookings = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
  `SELECT
     rb.id,
     rb.booking_id,
     rb.user_id,
     rb.room_id,

     r.room_number,

     r.building_id,
     b.name AS building_name,
     b.code AS building_code,

     r.room_type_id,
     rt.name AS room_type_name,

     rb.check_in,
     rb.check_out,
     rb.number_of_guests,
     rb.total_amount,

     rb.booking_status,
     rb.payment_status,

     rb.special_requests,

     u.full_name AS devotee_name,
     u.email AS devotee_email,
     u.phone AS devotee_phone,

     rb.created_at,
     rb.updated_at

   FROM room_bookings rb

   INNER JOIN rooms r
     ON rb.room_id = r.id

   LEFT JOIN buildings b
     ON r.building_id = b.id

   INNER JOIN room_types rt
     ON r.room_type_id = rt.id

   INNER JOIN users u
     ON rb.user_id = u.id

   ORDER BY rb.created_at DESC`
);
console.log(
  'ADMIN ROOM BOOKINGS:',
  JSON.stringify(result.rows, null, 2)
);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Error fetching admin room bookings:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch room bookings',
    });
  }
};


/*
 * Get single room booking for admin
 *
 * GET /api/admin/room-bookings/:bookingId
 */
export const getAdminRoomBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId } = req.params;

    const result = await pool.query(
        

      `
      
      SELECT
        rb.id,
        rb.booking_id,
        rb.user_id,
        rb.room_id,

        rb.check_in,
        rb.check_out,
        rb.number_of_guests,
        rb.total_amount,

        rb.booking_status,
        rb.payment_status,
        rb.special_requests,

        rb.created_at,
        rb.updated_at,

        u.full_name AS devotee_name,
        u.email AS devotee_email,
        u.phone AS devotee_phone,

        r.room_number,

        b.id AS building_id,
        b.name AS building_name,
        b.code AS building_code,

        rt.id AS room_type_id,
        rt.name AS room_type_name,
        rt.capacity AS room_capacity,
        rt.price_per_night

      FROM room_bookings rb

      INNER JOIN users u
        ON rb.user_id = u.id

      INNER JOIN rooms r
        ON rb.room_id = r.id

      INNER JOIN buildings b
        ON r.building_id = b.id

      INNER JOIN room_types rt
        ON r.room_type_id = rt.id

      WHERE rb.booking_id = $1
      `,
      [bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Error fetching admin room booking:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch room booking',
    });
  }
};


/*
 * Update booking status
 *
 * PUT /api/admin/room-bookings/:bookingId/status
 *
 * Allowed:
 * pending
 * confirmed
 * cancelled
 */
export const updateRoomBookingStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId } = req.params;
    const { booking_status } = req.body;

    const allowedStatuses = [
      'pending',
      'confirmed',
      'cancelled',
    ];

    if (!booking_status) {
      return res.status(400).json({
        success: false,
        message: 'booking_status is required',
      });
    }

    if (!allowedStatuses.includes(booking_status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid booking status. Allowed values: pending, confirmed, cancelled',
      });
    }

    const result = await pool.query(
      `
      UPDATE room_bookings

      SET
        booking_status = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE booking_id = $2

      RETURNING *
      `,
      [booking_status, bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    return res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Error updating room booking status:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
    });
  }
};


/*
 * Update payment status
 *
 * PUT /api/admin/room-bookings/:bookingId/payment-status
 *
 * Allowed:
 * pending
 * paid
 * failed
 * refunded
 */
export const updateRoomBookingPaymentStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId } = req.params;
    const { payment_status } = req.body;

    const allowedStatuses = [
      'pending',
      'paid',
      'failed',
      'refunded',
    ];

    if (!payment_status) {
      return res.status(400).json({
        success: false,
        message: 'payment_status is required',
      });
    }

    if (!allowedStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid payment status. Allowed values: pending, paid, failed, refunded',
      });
    }

    const result = await pool.query(
      `
      UPDATE room_bookings

      SET
        payment_status = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE booking_id = $2

      RETURNING *
      `,
      [payment_status, bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    return res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Error updating payment status:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
    });
  }
};