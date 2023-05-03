import express from 'express';
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

const router = express.Router();

router.use('/auth', AUTH);
router.use('/event', isAuthenticated, EVENT);
router.use('/batch', isAuthenticated, BATCH);
router.use('/internal', isAuthenticated, INTERNAL);
router.use('/parts', isAuthenticated, PARTS);
router.use('/station', STATION);
router.use('/config', CONFIG);
router.use('/queries', isAuthenticated, QUERIES);
router.use('/serial', isAuthenticated, SERIAL);
router.use('/alerts', ALERTS);

router.get('/', (req, res, next) => res.json({ ok: true }));


export default router;