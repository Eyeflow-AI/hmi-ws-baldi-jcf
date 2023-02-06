import express from 'express';
import AUTH, {isAuthenticated, isAuthorized} from './auth';
import EVENT from './event';

const router = express.Router();

router.use('/auth', AUTH);
router.use('/event', isAuthenticated, EVENT);

router.get('/', (req, res, next) => res.json({ ok: true }));


export default router;