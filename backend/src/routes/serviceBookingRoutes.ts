import { Router } from 'express';
import {
  createServiceBooking,
  getServiceBooking,
  getUserServiceBookings,
  getServiceBookingConfirmation,
   completeServiceBookingPayment,
} from '../controllers/serviceBookingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/',
  authenticateToken,
  createServiceBooking
);

router.get(
  '/my',
  authenticateToken,
  getUserServiceBookings
);
router.get(
  '/:bookingId/confirmation',
  authenticateToken,
  getServiceBookingConfirmation
);
router.post(
  '/:bookingId/pay',
  authenticateToken,
  completeServiceBookingPayment
);
router.get(
  '/:bookingId',
  authenticateToken,
  getServiceBooking
);

export default router;