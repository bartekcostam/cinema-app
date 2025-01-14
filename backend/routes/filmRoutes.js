// backend/routes/filmRoutes.js
import express from 'express';
import {
  addFilm,
  getFilms,
  getFilm,
  updateFilmCtrl,
  deleteFilmCtrl,
} from '../controllers/filmController.js';
import { verifyToken, isAdmin } from '../utils/authMiddleware.js';  // UWAGA: teraz importujemy też isAdmin

const router = express.Router();

// Dodawanie filmu (tylko dla zalogowanych adminów)
router.post('/', verifyToken, isAdmin, addFilm);

// Pobranie wszystkich filmów (publiczne)
router.get('/', getFilms);

// Pobranie pojedynczego filmu (publiczne)
router.get('/:id', getFilm);

// Edycja filmu (admin)
router.put('/:id', verifyToken, isAdmin, updateFilmCtrl);

// Usunięcie filmu (admin)
router.delete('/:id', verifyToken, isAdmin, deleteFilmCtrl);

export default router;
