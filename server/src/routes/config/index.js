import express from 'express';
import {
  GetVersion,
  GetConfigForFE,
  GetConfigForStationFE
} from './pages';

const router = express.Router();

router.get('/fe/version', GetVersion);
router.get('/fe', GetConfigForFE);
router.get('/fe/:stationId', GetConfigForStationFE);


export default router;
