import express from 'express';
import {
  GetPackageData,
  GetIconInfo,
  PutActiveDataset,
  GetFromToDocument,
} from './pages';

const router = express.Router();

router.get('/from-to-document', GetFromToDocument);
router.get('/package-data', GetPackageData);
router.get('/icon-info/:icon', GetIconInfo);
router.put('/active-dataset', PutActiveDataset);

export default router;
