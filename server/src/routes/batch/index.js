import express from 'express';
import {
  GetList,
  Get
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.get('/:batchId', Get);


export default router;
