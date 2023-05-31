import express from 'express';
import {
  GetParameters
} from './pages';
import { isAuthorized } from '../auth';


const router = express.Router();

router.get('/parameters', isAuthorized(['master', 'builder']), GetParameters);


export default router;
