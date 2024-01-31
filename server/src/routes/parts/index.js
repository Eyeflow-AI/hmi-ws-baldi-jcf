import express from 'express';
import {
  GetList,
  GetMaskMapList
} from './pages';

const router = express.Router();


router.get('/list', GetList);
router.get('/mask-map/list', GetMaskMapList);

export default router;
