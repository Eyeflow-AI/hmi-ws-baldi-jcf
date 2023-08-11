import express from 'express';
import {
  GetList,
  Get,
  GetRunning,
  PutPause,
  PutResume,
  PutFeedback,
} from './pages';

const router = express.Router();


router.get('/:stationId/list', GetList);
router.get('/:stationId/running', GetRunning);
router.get('/:stationId/:serialId', Get);

router.put('/:stationId/:serialId/pause', PutPause);
router.put('/:stationId/:serialId/resume', PutResume);
router.put('/:stationId/:serialId/feedback', PutFeedback);

export default router;
