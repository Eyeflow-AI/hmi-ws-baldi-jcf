import express from 'express';
import {
  GetData
  , Get
  , AddQuery
  , RemoveQuery
  , SaveQuery
  , RunQuery
} from './pages';

const router = express.Router();

router.post('/add-query', AddQuery);
router.delete('/remove-query', RemoveQuery);
router.put('/save-query', SaveQuery);
router.post('/run-query', RunQuery);

router.get('/:stationId/data', GetData);

router.get('/', Get);


export default router;
