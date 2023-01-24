import express from 'express';
import AUTH from './auth';

const router = express.Router();

router.use('/auth', AUTH);

/* GET home page. */
router.get('/', (req, res, next) => res.json({ ok: true }));


export default router;