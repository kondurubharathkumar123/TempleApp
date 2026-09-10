import { Router } from 'express';
import { uploadDarshanThumbnail } from '../middleware/uploadMiddleware';

import {
  getDarshanVideos,
  getAdminDarshanVideos,
  createDarshanVideo,
  updateDarshanVideo,
  deleteDarshanVideo,
} from '../controllers/darshanVideosController';

const router = Router();

/*
 * Public
 * Mobile application uses this endpoint.
 */
router.get(
  '/darshan-videos',
  getDarshanVideos
);

/*
 * Admin
 */
router.get(
  '/admin/darshan-videos',
  getAdminDarshanVideos
);

router.post(
  '/admin/darshan-videos',
  uploadDarshanThumbnail.single('thumbnail'),
  createDarshanVideo
);

router.put(
  '/admin/darshan-videos/:id',
  updateDarshanVideo
);

router.delete(
  '/admin/darshan-videos/:id',
  deleteDarshanVideo
);

export default router;