import { Router } from 'express';
import {
  getSevaCategories,
  getSevas,
} from '../controllers/sevaController';

const router = Router();

router.get('/categories', getSevaCategories);
router.get('/', getSevas);

export default router;