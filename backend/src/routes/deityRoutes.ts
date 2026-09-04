import { Router } from 'express';

import {
  getDeities,
  getDeityById,
} from '../controllers/deityController';

const router = Router();

router.get('/', getDeities);

router.get('/:id', getDeityById);

export default router;