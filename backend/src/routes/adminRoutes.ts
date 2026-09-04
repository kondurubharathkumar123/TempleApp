import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';
import {
  getDashboardSummary,
  getAllUsers,
  getUserById,
  getAllBuildings,
  updateUser,
  getAllRoomBookings,
   updateRoomBookingStatus,
    getAllServiceBookings,
     updateServiceBookingStatus,
     updateServicePaymentStatus,
       getAllRooms,
         createRoom,
           updateRoom,
            updateRoomStatus,
              getAllRoomTypes,
                createRoomType,
                updateRoomType,
                getAllEvents,
createEvent,
updateEvent,
updateEventStatus,
                updateRoomPaymentStatus

            } from '../controllers/adminController';
const router = Router();
router.patch(
  '/service-bookings/:id/payment-status',
  authenticateToken,
  requireAdmin,
  updateServicePaymentStatus
);
/* =========================================================
   EVENTS
========================================================= */

router.get(
  '/events',
  authenticateToken,
  requireAdmin,
  getAllEvents
);

router.post(
  '/events',
  authenticateToken,
  requireAdmin,
  createEvent
);

router.put(
  '/events/:id',
  authenticateToken,
  requireAdmin,
  updateEvent
);

router.patch(
  '/events/:id/status',
  authenticateToken,
  requireAdmin,
  updateEventStatus
);
router.get('/buildings', getAllBuildings);
router.patch(
  '/room-bookings/:id/payment-status',
  authenticateToken,
  requireAdmin,
  updateRoomPaymentStatus
);
router.put(
  '/room-types/:id',
  authenticateToken,
  requireAdmin,
  updateRoomType
);
router.post(
  '/room-types',
  authenticateToken,
  requireAdmin,
  createRoomType
);
router.get(
  '/room-types',
  authenticateToken,
  requireAdmin,
  getAllRoomTypes
);
router.patch(
  '/rooms/:id/status',
  authenticateToken,
  requireAdmin,
  updateRoomStatus
);
router.put(
  '/rooms/:id',
  authenticateToken,
  requireAdmin,
  updateRoom
);
router.post(
  '/rooms',
  authenticateToken,
  requireAdmin,
  createRoom
);
router.get(
  '/rooms',
  authenticateToken,
  requireAdmin,
  getAllRooms
);
router.get(
  '/service-bookings',
  authenticateToken,
  requireAdmin,
  getAllServiceBookings
);
router.patch(
  '/service-bookings/:id/status',
  authenticateToken,
  requireAdmin,
  updateServiceBookingStatus
);
router.patch(
  '/room-bookings/:id/status',
  authenticateToken,
  requireAdmin,
  updateRoomBookingStatus
);
router.get(
  '/room-bookings',
  authenticateToken,
  requireAdmin,
  getAllRoomBookings
);
router.put(
  '/users/:id',
  authenticateToken,
  requireAdmin,
  updateUser
);
router.get(
  '/users',
  authenticateToken,
  requireAdmin,
  getAllUsers
);
router.get(
  '/users/:id',
  authenticateToken,
  requireAdmin,
  getUserById
);

router.get(
  '/dashboard',
  authenticateToken,
  requireAdmin,
  getDashboardSummary
);

export default router;