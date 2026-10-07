import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';
import { uploadGalleryImage } from '../middleware/uploadMiddleware';
import {
  getAdminDeities, createDeity, updateDeity, deactivateDeity,
  getAdminGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem,
   getAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
    sendAnnouncementNotification,
} from '../controllers/adminContentController';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/deities', getAdminDeities);
router.post('/deities', createDeity);
router.put('/deities/:id', updateDeity);
router.delete('/deities/:id', deactivateDeity);

router.get('/gallery', getAdminGallery);
router.post(
  '/gallery',
  uploadGalleryImage.single('image'),
  createGalleryItem
);

router.put(
  '/gallery/:id',
  uploadGalleryImage.single('image'),
  updateGalleryItem
);
router.delete(
  '/gallery/:id',
  deleteGalleryItem
);

// ========================================
// ANNOUNCEMENTS
// ========================================

router.get(
  '/announcements',
  getAdminAnnouncements
);

router.post(
  '/announcements',
  createAnnouncement
);

router.put(
  '/announcements/:id',
  updateAnnouncement
);

router.delete(
  '/announcements/:id',
  deleteAnnouncement
);
router.post(
  '/announcements/:id/send',
  sendAnnouncementNotification
);
export default router;
