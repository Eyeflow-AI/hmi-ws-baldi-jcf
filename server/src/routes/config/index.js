import express from 'express';
import {
  GetConfigForFE,
  GetConfigForStationFE
} from './pages';

const router = express.Router();

router.get('/fe', GetConfigForFE);
router.get('/fe/:stationId', GetConfigForStationFE);


export default router;
