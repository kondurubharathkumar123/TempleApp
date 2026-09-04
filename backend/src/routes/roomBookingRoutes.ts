import { Router } from 'express';

import {
  createRoomBooking,
  getRoomBooking,
  getUserRoomBookings,
  getRoomBookingConfirmation,
  checkRoomAvailability,
} from '../controllers/roomBookingController';

import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/*
 * Create room booking
 * POST /api/room-bookings
 */
router.post(
  '/',
  authenticateToken,
  createRoomBooking
);

/*
 * Get logged-in user's room bookings
 * GET /api/room-bookings/my
 */
router.get(
  '/my',
  authenticateToken,
  getUserRoomBookings
);

/*
 * Check room availability
 * GET /api/room-bookings/:roomId/availability
 *
 * Login is not required.
 */
router.get(
  '/:roomId/availability',
  checkRoomAvailability
);

/*
 * Get booking confirmation
 * GET /api/room-bookings/:bookingId/confirmation
 */
router.get(
  '/:bookingId/confirmation',
  authenticateToken,
  getRoomBookingConfirmation
);

/*
 * Get single booking
 * GET /api/room-bookings/:bookingId
 */
router.get(
  '/:bookingId',
  authenticateToken,
  getRoomBooking
);

export default router;