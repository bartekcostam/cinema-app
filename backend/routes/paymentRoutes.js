import express from 'express';
import { verifyToken } from '../utils/authMiddleware.js';
import { confirmPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/confirm', verifyToken, confirmPayment);

export default router;