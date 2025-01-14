// backend/routes/roomRoutes.js
import express from 'express';
import { addRoom, getRooms, getRoom } from '../controllers/roomController.js';
// ewentualnie middleware auth, isAdmin, itd.

const router = express.Router();

// POST /api/rooms  (dodawanie nowej sali)
router.post('/', addRoom);

// GET /api/rooms   (lista wszystkich sal)
router.get('/', getRooms);

// GET /api/rooms/:id (szczegóły konkretnej sali)
router.get('/:id', getRoom);

export default router;
