import { Router } from 'express';

import {
  getGalleryAlbums,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
} from '../controllers/galleryAlbumController';

const router = Router();

router.get('/', getGalleryAlbums);
router.post('/', createGalleryAlbum);
router.put('/:id', updateGalleryAlbum);
router.delete('/:id', deleteGalleryAlbum);

export default router;