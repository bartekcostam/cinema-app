// backend/models/seanceModel.js
import { getDb } from './index.js';

export const createSeance = async (seanceData) => {
  const db = getDb();
  const {
    filmId,
    roomId,          // obca kolumna, łączy z rooms.id
    date,
    startTime,
    vipPrice,
    normalPrice,
    discountedPrice
  } = seanceData;

  // Wstawiamy do kolumn: filmId, roomId, ...
  const result = await db.run(
    `INSERT INTO seances
      (filmId, roomId, date, startTime, vipPrice, normalPrice, discountedPrice)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      filmId,
      roomId,
      date,
      startTime,
      vipPrice,
      normalPrice,
      discountedPrice,
    ]
  );

  return result.lastID; // ID nowego seansu
};

export const getAllSeances = async () => {
  const db = getDb();
  const seances = await db.all(`SELECT * FROM seances`);
  return seances;
};

export const getSeanceById = async (id) => {
  const db = getDb();
  const seance = await db.get(`SELECT * FROM seances WHERE id = ?`, [id]);
  return seance;
};

export const updateSeance = async (id, seanceData) => {
  const db = getDb();
  // UWAGA: tutaj też należy użyć 'roomId', jeśli chcemy edytować salę w seansie
  const {
    filmId,
    roomId,
    date,
    startTime,
    vipPrice,
    normalPrice,
    discountedPrice
  } = seanceData;

  await db.run(
    `UPDATE seances
     SET filmId = ?,
         roomId = ?,
         date = ?,
         startTime = ?,
         vipPrice = ?,
         normalPrice = ?,
         discountedPrice = ?
     WHERE id = ?`,
    [
      filmId,
      roomId,
      date,
      startTime,
      vipPrice,
      normalPrice,
      discountedPrice,
      id
    ]
  );
};

export const deleteSeance = async (id) => {
  const db = getDb();
  await db.run(`DELETE FROM seances WHERE id = ?`, [id]);
};
