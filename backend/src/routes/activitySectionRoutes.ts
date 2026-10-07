import { Router } from 'express';

import {
  getActivitySections,
  getActivitySectionById,
  getAdminActivitySections,
  createActivitySection,
  updateActivitySection,
  deactivateActivitySection,
} from '../controllers/activitySectionController';

import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

router.get(
  '/admin/all',
  authenticateToken,
  requireAdmin,
  getAdminActivitySections
);

router.post(
  '/admin',
  authenticateToken,
  requireAdmin,
  createActivitySection
);

router.put(
  '/admin/:id',
  authenticateToken,
  requireAdmin,
  updateActivitySection
);

router.delete(
  '/admin/:id',
  authenticateToken,
  requireAdmin,
  deactivateActivitySection
);

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

router.get('/', getActivitySections);

router.get('/:id', getActivitySectionById);

export default router;