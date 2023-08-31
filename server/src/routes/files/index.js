import express from 'express';
import {
  GetListDir,
  GetListNginx,
  GetListFromMongo,
  GetFolderListFromMongo,
} from './pages';

const router = express.Router();

router.get('/:stationId/list', GetListDir);
router.get('/list-nginx', GetListNginx);
router.get('/list-mongo', GetListFromMongo);
router.get('/folder-list-mongo', GetFolderListFromMongo);

export default router;