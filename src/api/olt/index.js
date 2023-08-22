import { Router } from 'express';

import {
  createOltHandler,
  deleteOltHandler,
  deleteOltIdHandler,
  getAllOltHandler,
  getOltByNameHandler,
  updateOltHandler,
} from './olt.controller.js';


const router = Router();

// /api/olts -> GET
router.get('/', getAllOltHandler);

// /api/olts -> POST
router.post('/', createOltHandler);

// /api/olts/single -> GET
router.get('/:name', getOltByNameHandler);

// /api/olts/ -> DELETE
router.delete('/:name', deleteOltHandler);
router.delete('/id/:id', deleteOltIdHandler);

// /api/olts/ -> PATCH
router.put('/', updateOltHandler);

export default router;