// backend/controllers/ticketController.js
import { getDb } from '../models/index.js';

// POST /api/tickets
export const createTickets = async (req, res) => {
  try {
    const { seanceId, tickets } = req.body; 
    // tickets: [{ seatNumber, ticketType }, ...]

    const db = getDb();

    // Sprawdź, czy seans istnieje:
    const seance = await db.get(`SELECT * FROM seances WHERE id = ?`, [seanceId]);
    if (!seance) {
      return res.status(400).json({ error: 'Seans nie istnieje' });
    }

    // Sprawdź dostępność każdego miejsca:
    for (const t of tickets) {
      const existing = await db.get(
        `SELECT * FROM tickets WHERE seanceId = ? AND seatNumber = ? AND status != 'cancelled'`,
        [seanceId, t.seatNumber]
      );
      if (existing) {
        return res.status(400).json({ error: `Miejsce ${t.seatNumber} jest już zarezerwowane` });
      }
    }

    // Wstaw rekordy w pętli (lub w transakcji):
    for (const t of tickets) {
      // Wylicz cenę na podstawie ticketType (VIP / normal / discounted)
      let price = 0;
      if (t.ticketType === 'VIP') price = seance.vipPrice;
      else if (t.ticketType === 'discounted') price = seance.discountedPrice;
      else price = seance.normalPrice;

      // Załóżmy, że userId bierzemy z req.user.id (potrzebny verifyToken)
      const userId = req.user?.id || null;

      await db.run(
        `INSERT INTO tickets (userId, seanceId, seatNumber, ticketType, price, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, seanceId, t.seatNumber, t.ticketType, price, 'reserved']
      );
    }

    // Jeśli wszystko OK
    res.status(201).json({ message: 'Bilety zarezerwowane pomyślnie' });
  } catch (err) {
    console.error('createTickets error:', err);
    res.status(500).json({ error: 'Błąd serwera przy rezerwacji' });
  }
};
