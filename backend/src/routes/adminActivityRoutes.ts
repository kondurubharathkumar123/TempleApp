import { Router } from 'express';

import {
  getAdminActivities,
  createActivity,
  updateActivity,
  deactivateActivity,
} from '../controllers/adminActivityController';

import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/', getAdminActivities);

router.post('/', createActivity);

router.put('/:id', updateActivity);

router.delete('/:id', deactivateActivity);

export default router;