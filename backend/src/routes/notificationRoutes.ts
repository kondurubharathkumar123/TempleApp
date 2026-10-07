import { Router } from 'express';

import {
  registerDevice,
  sendTestNotification,
} from '../controllers/notificationController';

import {
  authenticateToken,
} from '../middleware/authMiddleware';

const router = Router();

// ========================================
// REGISTER DEVICE FOR PUSH NOTIFICATIONS
// ========================================

router.post(
  '/register-device',
  authenticateToken,
  registerDevice
);

// ========================================
// SEND TEST PUSH NOTIFICATION
// ========================================

router.post(
  '/test',
  authenticateToken,
  sendTestNotification
);

export default router;  