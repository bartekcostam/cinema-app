import express from 'express';
import { createTickets } from '../controllers/ticketController.js';
import { verifyToken } from '../utils/authMiddleware.js';

const router = express.Router();

// Tworzenie biletów = rezerwacja
router.post('/', verifyToken, createTickets);

export default router;
