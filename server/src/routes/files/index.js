import express from 'express';
import {
  GetListDir
} from './pages';

const router = express.Router();

router.get('/:stationId/list', GetListDir);

export default router;