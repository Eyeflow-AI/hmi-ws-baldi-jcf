import express from 'express';
import {
  Get,
  Put,
  Delete,
  Post,
} from './pages';

const router = express.Router();

router.get('/:stationId', Get);
router.put('/:edgeId/:taskId', Put);
router.delete('/:edgeId/:taskId', Delete);
router.post('/:stationId', Post);

export default router;
