import express from 'express';
import {
  GetConfigForFE
} from './pages';

const router = express.Router();

router.get('/config-for-fe', GetConfigForFE);


export default router;
