// backend/models/roomModel.js
import { getDb } from './index.js';

export const createRoom = async (roomData) => {
  const db = getDb();
  const { roomNumber, rowsCount, colsCount, layout } = roomData;
  const result = await db.run(
    `INSERT INTO rooms (roomNumber, rowsCount, colsCount, layout)
     VALUES (?, ?, ?, ?)`,
    [roomNumber, rowsCount, colsCount, layout]
  );
  return result.lastID; // zwraca id nowo utworzonej sali
};

export const getRoomById = async (id) => {
  const db = getDb();
  const room = await db.get(`SELECT * FROM rooms WHERE id = ?`, [id]);
  return room;
};

export const getAllRooms = async () => {
  const db = getDb();
  const rooms = await db.all(`SELECT * FROM rooms`);
  return rooms;
};

// updateRoom, deleteRoom analogicznie...
