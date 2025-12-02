import express from 'express';
import filesRouter from './routes/files.router.js';

const router = express.Router();

router.use('/server', filesRouter);

export default router;
