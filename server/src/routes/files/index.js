import express from 'express';
import { isAuthenticated, isAuthorized } from '../auth';
import {
  GetListDir,
  GetListNginx,
  GetListFromMongo,
  GetFolderListFromMongo,
  GetListImages
} from './pages';

import {
  UploadImageInfo,
  DeleteFile,
  ResetDatasetFilesImagesCapture,
} from './tools';

const router = express.Router();

router.get('/:stationId/list', isAuthenticated, GetListDir);
router.get('/list-nginx', isAuthenticated, GetListNginx);
router.get('/list-mongo', isAuthenticated, GetListFromMongo);
router.get('/folder-list-mongo', isAuthenticated, GetFolderListFromMongo);
router.get('/list-images', isAuthenticated, GetListImages);
router.post('/tools/upload-image-info', isAuthenticated, UploadImageInfo);
router.delete('/tools/delete-file', DeleteFile);
router.put('/tools/reset-dataset-files-images-capture', ResetDatasetFilesImagesCapture);

export default router;
