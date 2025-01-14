// backend/routes/seanceRoutes.js
import express from 'express';
import { getAllSeancesWithFilm, getSeanceById } from '../controllers/seanceController.js';

const router = express.Router();

router.get('/', getAllSeancesWithFilm);
router.get('/:id', getSeanceById);

export default router;
