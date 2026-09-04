import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';
import {
  getAdminDeities, createDeity, updateDeity, deactivateDeity,
  getAdminGallery, createGalleryItem, updateGalleryItem, deactivateGalleryItem,
} from '../controllers/adminContentController';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/deities', getAdminDeities);
router.post('/deities', createDeity);
router.put('/deities/:id', updateDeity);
router.delete('/deities/:id', deactivateDeity);

router.get('/gallery', getAdminGallery);
router.post('/gallery', createGalleryItem);
router.put('/gallery/:id', updateGalleryItem);
router.delete('/gallery/:id', deactivateGalleryItem);

export default router;
