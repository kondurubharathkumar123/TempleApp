import { Router } from 'express';

import {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from '../controllers/buildingController';

const router = Router();

router.get('/', getBuildings);

router.post('/', createBuilding);

router.put('/:id', updateBuilding);

router.delete('/:id', deleteBuilding);

export default router;