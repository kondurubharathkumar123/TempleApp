import { Router } from 'express';

import {
  getAllAdminAnnouncements,createAnnouncement,updateAnnouncement,  toggleAnnouncementStatus, sendAnnouncementNow,
  scheduleAnnouncement,
} from '../controllers/adminAnnouncementController';

import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// ========================================
// ADMIN: GET ALL ANNOUNCEMENTS
// ========================================

router.get(
  '/',
  authenticateToken,
  getAllAdminAnnouncements
);
router.post(
  '/',
  authenticateToken,
  createAnnouncement
);
// ========================================
// ADMIN: UPDATE ANNOUNCEMENT
// ========================================

router.put(
  '/:id',
  authenticateToken,
  updateAnnouncement
);
// ========================================
// ADMIN: ACTIVATE / DEACTIVATE
// ========================================

router.patch(
  '/:id/status',
  authenticateToken,
  toggleAnnouncementStatus
);
// ========================================
// ADMIN: SEND NOW
// ========================================

router.post(
  '/:id/send',
  authenticateToken,
  sendAnnouncementNow
);


// ========================================
// ADMIN: SCHEDULE
// ========================================

router.post(
  '/:id/schedule',
  authenticateToken,
  scheduleAnnouncement
);
export default router;