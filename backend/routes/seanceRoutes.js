// backend/routes/seanceRoutes.js
import express from 'express';
import { getAllSeancesWithFilm } from '../controllers/seanceController.js';
// ewentualnie inne funkcje, np. createSeance, updateSeance, etc.

const router = express.Router();

// GET /api/seances
router.get('/', getAllSeancesWithFilm);

export default router;
