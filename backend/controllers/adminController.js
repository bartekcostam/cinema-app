// backend/controllers/adminController.js
import { getDb } from '../models/index.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const db = getDb();
    // policz userów:
    const rowUsers = await db.get(`SELECT COUNT(*) as count FROM users`);
    const rowFilms = await db.get(`SELECT COUNT(*) as count FROM films`);
    const rowSeances = await db.get(`SELECT COUNT(*) as count FROM seances`);
    const rowTickets = await db.get(`SELECT COUNT(*) as count FROM tickets`);

    res.json({
      totalUsers: rowUsers.count,
      totalFilms: rowFilms.count,
      totalSeances: rowSeances.count,
      totalTickets: rowTickets.count,
      // Możesz dodać inne statystyki...
    });
  } catch (err) {
    console.error('getAdminDashboard error:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
