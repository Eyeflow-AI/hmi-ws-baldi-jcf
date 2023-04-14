import express from 'express';
import {
  GetPackageData,
  GetIconInfo,
  PutActiveDataset,
  GetFromToDocument,
  GetLanguagesData,
  PutActiveLanguage,
  PutDefaultLanguage,
} from './pages';

const router = express.Router();

router.get('/from-to-document', GetFromToDocument);
router.get('/package-data', GetPackageData);
router.get('/languages-data', GetLanguagesData);
router.get('/icon-info/:icon', GetIconInfo);
router.put('/active-dataset', PutActiveDataset);
router.put('/active-language', PutActiveLanguage);
router.put('/default-language', PutDefaultLanguage);
export default router;
