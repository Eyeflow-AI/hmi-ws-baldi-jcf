import express from 'express';
import {
  GetList,
  Get,
  PostInspectionEvent,
  PostStagingEvent,
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.post('/inspection', PostInspectionEvent);
router.post('/staging', PostInspectionEvent);
router.get('/:eventId', Get);

export default router;
