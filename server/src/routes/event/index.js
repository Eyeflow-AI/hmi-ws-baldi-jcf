import express from 'express';
import {
  GetList,
  PostInspectionEvent,
  PostStagingEvent,
  PostEventToUpload,
  PostDebugEvent,
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.post('/inspection', PostInspectionEvent);
router.post('/staging', PostStagingEvent);
router.post('/debug', PostDebugEvent);
router.post('/to-upload', PostEventToUpload);

export default router;
