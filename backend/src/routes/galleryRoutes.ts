import { Router } from 'express';

import {
  getGallery,
  getGalleryAlbums,
} from '../controllers/galleryController';

const router = Router();

/*
 * Grouped gallery
 *
 * GET /api/gallery/albums
 */
router.get(
  '/albums',
  getGalleryAlbums
);

/*
 * Existing flat gallery
 *
 * GET /api/gallery
 */
router.get(
  '/',
  getGallery
);

export default router;