import express from 'express';
import AUTH, { isAuthenticated, isAuthorized } from './auth';
import EVENT from './event';
import BATCH from './batch';
import INTERNAL from './internal';
import STATION from './station';

const router = express.Router();

router.use('/auth', AUTH);
router.use('/event', isAuthenticated, EVENT);
router.use('/batch', isAuthenticated, BATCH);
router.use('/internal', isAuthenticated, INTERNAL);
router.use('/station', STATION);

router.get('/', (req, res, next) => res.json({ ok: true }));


export default router;