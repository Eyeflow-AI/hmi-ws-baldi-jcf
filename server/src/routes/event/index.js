import express from 'express';
import {
  GetList,
  PostInspectionEvent,
  PostStagingEvent,
  PostEventToUpload,
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.post('/inspection', PostInspectionEvent);
router.post('/staging', PostStagingEvent);
router.post('/to-upload', PostEventToUpload);

export default router;
