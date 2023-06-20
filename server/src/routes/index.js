import express, { Router } from 'express';
import AUTH, { isAuthenticated, isAuthorized } from './auth';
import EVENT from './event';
import BATCH from './batch';
import INTERNAL from './internal';
import PARTS from './parts';
import STATION from './station';
import CONFIG from './config';
import QUERIES from './queries';
import SERIAL from './serial';
import ALERTS from './alerts';
import TEST from './test';
import CHECKLIST from './checklist';
import FILES from './files';

const router = express.Router();

router.use('/auth', AUTH);
router.use('/event', EVENT);
router.use('/batch', isAuthenticated, BATCH);
router.use('/internal', INTERNAL);
router.use('/parts', isAuthenticated, PARTS);
router.use('/station', STATION);
router.use('/config', CONFIG);
router.use('/queries', isAuthenticated, QUERIES);
router.use('/serial', isAuthenticated, SERIAL);
router.use('/files', isAuthenticated, FILES);
router.use('/alerts', ALERTS);
router.use('/test', TEST);
router.use('/checklist', CHECKLIST);

router.get('/', (req, res, next) => res.json({ ok: true }));


export default router;