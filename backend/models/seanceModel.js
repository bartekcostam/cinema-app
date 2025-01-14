// backend/models/seanceModel.js
import { getDb } from './index.js';

export const createSeance = async (seanceData) => {
  const db = getDb();
  const { filmId, date, startTime, roomNumber, vipPrice, normalPrice, discountedPrice } = seanceData;
  const result = await db.run(
    `INSERT INTO seances (filmId, date, startTime, roomNumber, vipPrice, normalPrice, discountedPrice)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [filmId, date, startTime, roomNumber, vipPrice, normalPrice, discountedPrice]
  );
  return result.lastID;
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

// update, delete analogicznie
export const updateSeance = async (id, seanceData) => {
  const db = getDb();
  const { filmId, date, startTime, roomNumber, vipPrice, normalPrice, discountedPrice } = seanceData;
  await db.run(
    `UPDATE seances
     SET filmId = ?, date = ?, startTime = ?, roomNumber = ?, vipPrice = ?, normalPrice = ?, discountedPrice = ?
     WHERE id = ?`,
    [filmId, date, startTime, roomNumber, vipPrice, normalPrice, discountedPrice, id]
  );
};

export const deleteSeance = async (id) => {
  const db = getDb();
  await db.run(`DELETE FROM seances WHERE id = ?`, [id]);
};
