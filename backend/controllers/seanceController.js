// backend/controllers/seanceController.js
import { getDb } from '../models/index.js';

export const getAllSeancesWithFilm = async (req, res) => {
  try {
    const db = getDb();
    // Zwracamy seanse wraz z filmami i danymi sali
    const query = `
      SELECT
        seances.id AS seanceId,
        seances.date,
        seances.startTime,
        seances.vipPrice,
        seances.normalPrice,
        seances.discountedPrice,
        rooms.id AS roomId,
        rooms.roomNumber,
        rooms.rowsCount,
        rooms.colsCount,
        rooms.layout,
        films.id AS filmId,
        films.title,
        films.genre,
        films.duration
      FROM seances
      JOIN films ON seances.filmId = films.id
      JOIN rooms ON seances.roomId = rooms.id
      ORDER BY seances.date, seances.startTime
    `;

    const seances = await db.all(query);
    res.json(seances);
  } catch (error) {
    console.error('getAllSeancesWithFilm error:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania seansów' });
  }
};

// Pojedynczy seans (z salą i filmem) - np. do seat selection
export const getSeanceById = async (req, res) => {
  try {
    const db = getDb();
    const seanceId = req.params.id;

    const query = `
      SELECT
        seances.id AS seanceId,
        seances.date,
        seances.startTime,
        seances.vipPrice,
        seances.normalPrice,
        seances.discountedPrice,
        rooms.id AS roomId,
        rooms.roomNumber,
        rooms.rowsCount,
        rooms.colsCount,
        rooms.layout,
        films.id AS filmId,
        films.title,
        films.genre,
        films.duration
      FROM seances
      JOIN films ON seances.filmId = films.id
      JOIN rooms ON seances.roomId = rooms.id
      WHERE seances.id = ?
    `;

    const seance = await db.get(query, [seanceId]);
    if (!seance) {
      return res.status(404).json({ error: 'Seans nie znaleziony' });
    }
    res.json(seance);
  } catch (error) {
    console.error('getSeanceById error:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
