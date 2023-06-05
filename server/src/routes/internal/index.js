import express from 'express';
import {
  GetPackageData
  , GetIconInfo
  , PutActiveDataset
  , GetFromToDocument
  , GetLanguagesData
  , PutActiveLanguage
  , PutDefaultLanguage
  , GetParameters
} from './pages';
import { isAuthorized, isAuthenticated } from '../auth';

const router = express.Router();

router.get('/from-to-document', isAuthenticated, GetFromToDocument);
router.get('/package-data', isAuthenticated, GetPackageData);
router.get('/languages-data', isAuthenticated, GetLanguagesData);
router.get('/icon-info/:icon', isAuthenticated, GetIconInfo);
router.put('/active-dataset', isAuthenticated, PutActiveDataset);
router.put('/active-language', isAuthenticated, PutActiveLanguage);
router.put('/default-language', isAuthenticated, PutDefaultLanguage);
router.get('/parameters', isAuthenticated, isAuthorized(['master', 'builder']), GetParameters);

export default router;
