import { Router } from 'express';

import {
  getActivities,
  getActivitiesBySection,
  getActivityById,
} from '../controllers/activityController';

const router = Router();

router.get('/', getActivities);

router.get(
  '/section/:sectionId',
  getActivitiesBySection
);

router.get(
  '/:id',
  getActivityById
);

export default router;