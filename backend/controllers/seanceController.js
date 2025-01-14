// backend/controllers/seanceController.js
import { getDb } from '../models/index.js';

export const getAllSeancesWithFilm = async (req, res) => {
  try {
    const db = getDb();
    // Zwracamy seanse wraz z podstawowymi danymi filmu
    // Zakładamy, że nazwa kolumn w seances to: filmId, date, startTime, roomNumber, ...
    // a w films: title, genre, duration, ...

    const query = `
      SELECT
        seances.id AS seanceId,
        seances.date,
        seances.startTime,
        seances.roomNumber,
        seances.vipPrice,
        seances.normalPrice,
        seances.discountedPrice,
        films.id AS filmId,
        films.title,
        films.genre,
        films.duration
      FROM seances
      JOIN films ON seances.filmId = films.id
      ORDER BY seances.date, seances.startTime
    `;

    const seances = await db.all(query);
    // seances to tablica obiektów, np.:
    // { seanceId: 1, date: '2025-01-15', startTime: '18:00', roomNumber: 2, filmId: 5, title: 'Film ...', genre: 'Akcja' }

    res.json(seances);
  } catch (error) {
    console.error('getAllSeancesWithFilm error:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania seansów' });
  }
};
