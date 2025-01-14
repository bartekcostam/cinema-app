// backend/routes/snackRoutes.js

import express from 'express';
import {
  addSnack,
  getSnacks,
  getSingleSnack,
  updateSnackCtrl,
  deleteSnackCtrl,
} from '../controllers/snackController.js';

import { verifyToken, isAdmin } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * /api/snacks
 */

// Lista snacków (publiczna? czy tylko dla admina?):
router.get('/', getSnacks);

// Dodawanie snacka (tylko admin)
router.post('/', verifyToken, isAdmin, addSnack);

// Pobranie pojedynczego snacka
router.get('/:id', getSingleSnack);

// Aktualizacja snacka (admin)
router.put('/:id', verifyToken, isAdmin, updateSnackCtrl);

// Usunięcie snacka (admin)
router.delete('/:id', verifyToken, isAdmin, deleteSnackCtrl);

export default router;
