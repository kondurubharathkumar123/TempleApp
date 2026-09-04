import { Router } from 'express';

import { getDarshanSlots , getAllActiveDarshanSlots,} from '../controllers/darshanController';

const router = Router();

router.get('/', getDarshanSlots);
router.get('/all', getAllActiveDarshanSlots);
export default router;