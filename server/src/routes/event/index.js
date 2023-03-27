import express from 'express';
import {
  GetList,
  Get,
  Post
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.get('/:eventId', Get);
router.get('/', Post);

export default router;
