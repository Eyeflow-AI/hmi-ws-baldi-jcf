import express from 'express';
import {
  GetPackageData
} from './pages';

const router = express.Router();


router.get('/package-data', GetPackageData);


export default router;
