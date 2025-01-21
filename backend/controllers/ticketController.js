// backend/controllers/ticketController.js
import { getDb } from '../models/index.js';

/**
 * POST /api/tickets
 * Tworzy (rezerwuje) bilety.
 */
export const createTickets = async (req, res) => {
  console.log('createTickets wywołane');
  try {
    const { seanceId, tickets } = req.body;
    console.log('createTickets body:', req.body);

    const db = getDb(); // Wywołanie synchronously

    // Sprawdzenie, czy seans istnieje
    const seance = await db.get(`SELECT * FROM seances WHERE id = ?`, [seanceId]);
    console.log('Seance fetched:', seance);
    if (!seance) {
      console.log('Seans nie istnieje');
      return res.status(400).json({ error: 'Seans nie istnieje' });
    }

    // Sprawdzenie dostępności miejsc
    for (const t of tickets) {
      console.log(`Sprawdzanie dostępności miejsca: seanceId=${seanceId}, seatNumber=${t.seatNumber}`);
      const existing = await db.get(`
        SELECT * FROM tickets
        WHERE seanceId = ?
          AND seatNumber = ?
          AND status != 'cancelled'
      `, [seanceId, t.seatNumber]);

      console.log('Existing ticket:', existing);
      if (existing) {
        console.log(`Miejsce ${t.seatNumber} jest już zarezerwowane`);
        return res.status(400).json({ error: `Miejsce ${t.seatNumber} jest już zarezerwowane` });
      }
    }

    // Wstawianie biletów
    for (const t of tickets) {
      let price = seance.normalPrice;
      if (t.ticketType === 'VIP') price = seance.vipPrice;
      else if (t.ticketType === 'discounted') price = seance.discountedPrice;

      const userId = req.user.userId || null; // Upewnienie się, że JWT zawiera userId

      console.log(`Rezerwowanie biletu: userId=${userId}, seanceId=${seanceId}, seatNumber=${t.seatNumber}, ticketType=${t.ticketType}, price=${price}`);

      await db.run(
        `INSERT INTO tickets (userId, seanceId, seatNumber, ticketType, price, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, seanceId, t.seatNumber, t.ticketType, price, 'reserved']
      );
    }

    res.status(201).json({ message: 'Bilety zarezerwowane pomyślnie' });
  } catch (err) {
    console.error('createTickets error:', err);
    res.status(500).json({ error: 'Błąd serwera przy rezerwacji' });
  }
};

/**
 * GET /api/tickets?seanceId=123
 * Zwraca listę biletów dla danego seansu.
 */
export const getTicketsBySeance = async (req, res) => {
  console.log('getTicketsBySeance wywołane');
  try {
    const { seanceId } = req.query;
    console.log('getTicketsBySeance query:', req.query);
    if (!seanceId) {
      console.log('Brak parametru seanceId');
      return res.status(400).json({ error: 'Brak parametru seanceId' });
    }

    const db = getDb();
    const tickets = await db.all(`
      SELECT id, userId, seanceId, seatNumber, ticketType, price, status
      FROM tickets
      WHERE seanceId = ?
    `, [seanceId]);

    console.log(`Bilety dla seanceId=${seanceId}:`, tickets);
    res.json(tickets);
  } catch (error) {
    console.error('getTicketsBySeance error:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu biletów seansu' });
  }
};

/**
 * GET /api/tickets/my
 * Zwraca listę biletów zarezerwowanych przez zalogowanego użytkownika.
 */
export const getMyTickets = async (req, res) => {
  console.log('getMyTickets wywołane');
  try {
    const userId = req.user.userId;
    console.log('getMyTickets userId:', userId);
    const db = getDb();

    const tickets = await db.all(`
      SELECT 
        t.id, 
        t.seanceId, 
        t.seatNumber, 
        t.ticketType, 
        t.price, 
        t.status,
        s.date, 
        s.startTime, 
        f.title AS filmTitle, 
        r.roomNumber
      FROM tickets t
      JOIN seances s ON t.seanceId = s.id
      JOIN films f ON s.filmId = f.id
      JOIN rooms r ON s.roomId = r.id
      WHERE t.userId = ?
      ORDER BY s.date, s.startTime
    `, [userId]);

    console.log(`Rezerwacje użytkownika ${userId}:`, tickets);
    res.json(tickets);
  } catch (error) {
    console.error('getMyTickets error:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu rezerwacji użytkownika' });
  }
};
