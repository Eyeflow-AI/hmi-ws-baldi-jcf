import express from 'express';
import {
  GetData
  , Get
  , AddQuery
  , RemoveQuery
  , SaveQuery
  , RunQuery
} from './pages';
import { isAuthenticated, isAuthorized } from '../auth';


const router = express.Router();

router.post('/add-query', isAuthorized(['master', 'builder']), AddQuery);
router.delete('/remove-query', isAuthorized(['master', 'builder']), RemoveQuery);
router.put('/save-query', isAuthorized(['master', 'builder']), SaveQuery);
router.post('/run-query', RunQuery);

router.get('/:stationId/data', GetData);

router.get('/', Get);


export default router;
