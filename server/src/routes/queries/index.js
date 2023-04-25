import express from 'express';
import {
  GetData
  , Get
} from './pages';

const router = express.Router();

router.get('/:stationId/data', GetData);

router.get('/', Get);


export default router;
