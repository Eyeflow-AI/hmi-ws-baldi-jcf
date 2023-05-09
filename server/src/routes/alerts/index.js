import express from 'express';
import {
  Get,
  Put,
  Delete,
  Post,
} from './pages';
import { isAuthenticated } from '../auth';

const router = express.Router();

router.get('/:stationId', Get);
router.put('/:stationId', isAuthenticated, Put);
router.delete('/:stationId', Delete);
router.post('/:stationId', Post);
export default router;
