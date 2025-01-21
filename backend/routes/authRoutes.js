// backend/routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken } from '../utils/authMiddleware.js'; // Importujemy verifyToken

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/test-token - Tymczasowy endpoint do testowania tokena
router.get('/test-token', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
