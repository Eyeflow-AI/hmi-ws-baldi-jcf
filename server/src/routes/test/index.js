import express from 'express';
import {
  GetList
  , GetImage
} from './pages';

const router = express.Router();


router.get('/:name', GetImage);
router.get('/', GetList);


export default router;
