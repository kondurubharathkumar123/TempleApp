import { Router } from 'express';

import {
  getAnnouncements,
  getAnnouncementById,
} from '../controllers/announcementController';

const router = Router();

// Get all published announcements
router.get(
  '/',
  getAnnouncements
);

// Get one published announcement
router.get(
  '/:id',
  getAnnouncementById
);

export default router;