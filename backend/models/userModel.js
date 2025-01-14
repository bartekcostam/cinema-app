import { getDb } from './index.js';

export const createUser = async (userData) => {
  // userData: { firstName, lastName, email, password (zahashowane), role }
  const db = getDb();
  const { firstName, lastName, email, password, role } = userData;

  const result = await db.run(
    `INSERT INTO users (firstName, lastName, email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [firstName, lastName, email, password, role]
  );

  // result.lastID zawiera ID nowo wstawionego rekordu
  return result.lastID;
};

export const getUserByEmail = async (email) => {
  const db = getDb();
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  return user;
};

export const getUserById = async (id) => {
  const db = getDb();
  const user = await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
  return user;
};

// Możemy dodać np. updateUser, deleteUser, getAllUsers itp. w przyszłości