import express from 'express';
import {
  Get,
  Delete,
  Post,
} from './pages';
import { isAuthenticated } from '../auth';

const router = express.Router();

router.get('/:stationId', Get);
router.delete('/:stationId/:alertId', isAuthenticated, Delete);
router.post('/:stationId', isAuthenticated, Post);

export default router;
