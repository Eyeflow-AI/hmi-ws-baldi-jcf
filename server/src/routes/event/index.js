import express from 'express';
import {
  GetList
} from './pages';

const router = express.Router();


router.get('/list', GetList);


export default router;
