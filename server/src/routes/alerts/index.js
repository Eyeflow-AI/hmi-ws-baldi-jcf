import express from 'express';
import {
  Get,
  Delete,
  Post,
} from './pages';
import { isAuthenticated } from '../auth';

const router = express.Router();

router.get('/:stationId', Get);
router.delete('/:stationId', Delete);
router.post('/:stationId', Post);
export default router;
