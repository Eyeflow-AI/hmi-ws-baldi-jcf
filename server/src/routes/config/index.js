import express from 'express';
import {
  GetConfigForFE,
  GetConfigForStationFE,
  GetVersion
} from './pages';

const router = express.Router();

router.get('/fe', GetConfigForFE);
router.get('/fe/:stationId', GetConfigForStationFE);
router.get('/fe/version', GetVersion);


export default router;
