import express from 'express';
import {
  Post,
  GetList,
  Get,
  GetData,
  GetRunning,
  PutPauseOrStop,
  PutResume
} from './pages';

const router = express.Router();


router.post('/:stationId', Post);
router.get('/:stationId/list', GetList);
router.get('/:stationId/running', GetRunning);
router.get('/:stationId/:batchId', Get);
router.get('/:stationId/:batchId/data', GetData);

router.put('/:stationId/:batchId/pause', PutPauseOrStop);
router.put('/:stationId/:batchId/stop', PutPauseOrStop);
router.put('/:stationId/:batchId/resume', PutResume);

export default router;
