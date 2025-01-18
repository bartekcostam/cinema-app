// backend/routes/userRoutes.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserByAdmin,
  deleteUser
} from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../utils/authMiddleware.js';

const router = express.Router();

// Użytkownik – GET/PUT me
router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, updateProfile);

// Admin – getAllUsers, updateUserByAdmin, deleteUser
router.get('/', verifyToken, isAdmin, getAllUsers);
router.put('/:id', verifyToken, isAdmin, updateUserByAdmin);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
