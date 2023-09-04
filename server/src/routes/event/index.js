import express from 'express';
import {
  GetList,
  PostInspectionEvent,
  PostStagingEvent,
  PostEventToUpload,
  PostDebugEvent,
  PostDetectionsImage,
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.post('/inspection', PostInspectionEvent);
router.post('/staging', PostStagingEvent);
router.post('/debug', PostDebugEvent);
router.post('/to-upload', PostEventToUpload);
router.post('/detections-image', PostDetectionsImage);

export default router;
