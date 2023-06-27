import express from 'express';
import {
  GetList,
  PostInspectionEvent,
  PostStagingEvent,
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.post('/inspection', PostInspectionEvent);
router.post('/staging', PostStagingEvent);

export default router;
