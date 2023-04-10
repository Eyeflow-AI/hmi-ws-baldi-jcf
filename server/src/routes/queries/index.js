import express from 'express';
import {
  GetData,
} from './pages';

const router = express.Router();


router.get('/:stationId/data', GetData);

export default router;
