import { Router } from 'express';
import {
  getRoomTypes,
  getRooms,
} from '../controllers/roomController';

const router = Router();

router.get('/types', getRoomTypes);
router.get('/', getRooms);

export default router;