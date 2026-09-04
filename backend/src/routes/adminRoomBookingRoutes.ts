import { Router } from 'express';

import {
  getAllRoomBookings,
  getAdminRoomBooking,
  updateRoomBookingStatus,
  updateRoomBookingPaymentStatus,
} from '../controllers/adminRoomBookingController';

import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/*
 * Admin room bookings
 */
router.get(
  '/',
  authenticateToken,
  getAllRoomBookings
);

/*
 * Single booking
 */
router.get(
  '/:bookingId',
  authenticateToken,
  getAdminRoomBooking
);

/*
 * Update booking status
 */
router.put(
  '/:bookingId/status',
  authenticateToken,
  updateRoomBookingStatus
);

/*
 * Update payment status
 */
router.put(
  '/:bookingId/payment-status',
  authenticateToken,
  updateRoomBookingPaymentStatus
);

export default router;