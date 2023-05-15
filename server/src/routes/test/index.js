import express from 'express';
import {
  GetCameras
  , GetImage
} from './pages';

const router = express.Router();


router.get('/cameras', GetCameras);
router.get('/cameras/:name', GetImage);


export default router;
