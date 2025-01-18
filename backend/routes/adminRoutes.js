import express from 'express';
import { verifyToken, isAdmin } from '../utils/authMiddleware.js';
import { getAdminDashboard } from '../controllers/adminController.js';

const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', verifyToken, isAdmin, getAdminDashboard);

export default router;
