import express from 'express';
import {
  GetList,
  Get,
  GetRunning,
  PutPause,
  PutResume
} from './pages';

const router = express.Router();


router.get('/:stationId/list', GetList);
router.get('/:stationId/running', GetRunning);
router.get('/:stationId/:batchId', Get);

router.put('/:stationId/:batchId/pause', PutPause);
router.put('/:stationId/:batchId/resume', PutResume);

export default router;
