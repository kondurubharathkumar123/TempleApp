import { Router } from 'express';

import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

import {
  getAllDarshanSlots,
  createDarshanSlot,
  updateDarshanSlot,
  updateDarshanSlotStatus,
} from '../controllers/adminDarshanController';

const router = Router();

/*
 * Get all Darshan slots
 */
router.get(
  '/',
  authenticateToken,
  requireAdmin,
  getAllDarshanSlots
);

/*
 * Create Darshan slot
 */
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  createDarshanSlot
);

/*
 * Update Darshan slot
 */
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  updateDarshanSlot
);

/*
 * Activate / deactivate Darshan slot
 */
router.patch(
  '/:id/status',
  authenticateToken,
  requireAdmin,
  updateDarshanSlotStatus
);

export default router;