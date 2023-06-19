import express from 'express';
import {
  GetList,
  Put,
} from './pages';
import { isAuthenticated, isAuthorized } from '../auth';

const router = express.Router();


router.get('/list', GetList);
router.put('/:stationId', isAuthenticated, isAuthorized(['master']), Put);


export default router;
