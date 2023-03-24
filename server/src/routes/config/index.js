import express from 'express';
import {
  GetConfigForFE
} from './pages';

const router = express.Router();

router.get('/fe', GetConfigForFE);


export default router;
