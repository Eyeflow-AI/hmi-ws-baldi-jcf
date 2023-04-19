import express from 'express';
import {
  GetList,
  Get,
  GetData,
  GetRunning,
  PutPause,
  PutResume
} from './pages';

const router = express.Router();


router.get('/:stationId/list', GetList);
router.get('/:stationId/running', GetRunning);
router.get('/:stationId/:serialId', Get);
router.get('/:stationId/:serialId/data', GetData);

router.put('/:stationId/:serialId/pause', PutPause);
router.put('/:stationId/:serialId/resume', PutResume);

export default router;
