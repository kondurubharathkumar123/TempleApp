import { Router } from 'express';
import { getPublications } from '../controllers/publicationController';

const router = Router();

router.get('/', getPublications);

export default router;