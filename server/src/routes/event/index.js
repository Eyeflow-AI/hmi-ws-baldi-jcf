import express from 'express';
import {
  GetList,
  Get,
  PostInspectionEvent,
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.post('/inspection', PostInspectionEvent);
router.get('/:eventId', Get);

export default router;
