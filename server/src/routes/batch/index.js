import express from 'express';
import {
  GetList,
  Get,
  GetRunning
} from './pages';

const router = express.Router();


router.get('/:stationId/list', GetList);
router.get('/:stationId/running', GetRunning);
router.get('/:stationId/:batchId', Get);


export default router;
