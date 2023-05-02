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
router.put('/', isAuthenticated, Put);
router.delete('/', Delete);
router.post('/', Post);
export default router;
