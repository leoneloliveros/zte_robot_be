import { Router } from 'express';

import {
  getPortInformationHandler,
} from './automation.controller.js';

const router = Router();

// /api/automation -> POST
router.post('/', getPortInformationHandler);

export default router;