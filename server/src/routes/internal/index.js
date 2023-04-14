import express from 'express';
import {
  GetPackageData,
  GetIconInfo,
  PutActiveDataset,
  GetFromToDocument,
  GetLanguagesData,
} from './pages';

const router = express.Router();

router.get('/from-to-document', GetFromToDocument);
router.get('/package-data', GetPackageData);
router.get('/languages-data', GetLanguagesData);
router.get('/icon-info/:icon', GetIconInfo);
router.put('/active-dataset', PutActiveDataset);

export default router;
