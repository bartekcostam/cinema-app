// backend/routes/ticketRoutes.js
import express from 'express';
import { verifyToken } from '../utils/authMiddleware.js';
import {
  createTickets,
  getTicketsBySeance,
  getMyTickets
} from '../controllers/ticketController.js';

const router = express.Router();

// Middleware logujące wszystkie żądania do ticketRoutes
router.use((req, res, next) => {
  console.log(`TicketRoutes - ${req.method} ${req.path}`);
  next();
});

/**
 * POST /api/tickets
 * Tworzy (rezerwuje) bilety.
 */
router.post('/', verifyToken, createTickets);

/**
 * GET /api/tickets?seanceId=123
 * Zwraca listę biletów dla danego seansu (np. do sprawdzenia zajętych miejsc).
 */
router.get('/', verifyToken, getTicketsBySeance);

/**
 * GET /api/tickets/my
 * Zwraca listę biletów zarezerwowanych przez zalogowanego użytkownika.
 */
router.get('/my', verifyToken, getMyTickets);

export default router;
