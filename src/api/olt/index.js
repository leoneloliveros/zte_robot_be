import { Router } from 'express';

import {
  createOltHandler,
  deleteOltHandler,
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
router.get('/single', getOltByNameHandler);

// /api/olts/ -> DELETE
router.delete('/', deleteOltHandler);

// /api/olts/ -> PATCH
router.patch('/', updateOltHandler);

export default router;