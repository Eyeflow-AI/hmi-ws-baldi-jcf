import express from 'express';
import {
  GetPackageData,
  GetIconInfo
} from './pages';

const router = express.Router();


router.get('/package-data', GetPackageData);
router.get('/icon-info/:icon', GetIconInfo);

export default router;
