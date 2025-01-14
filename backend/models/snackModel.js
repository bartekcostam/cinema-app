// backend/models/snackModel.js

import { getDb } from './index.js';

/**
 * Tworzy nowy snack (produkt)
 * snackData: { name, price, quantity }
 */
export const createSnack = async (snackData) => {
  const db = getDb();
  const { name, price, quantity } = snackData;
  const result = await db.run(
    `INSERT INTO snacks (name, price, quantity)
     VALUES (?, ?, ?)`,
    [name, price, quantity]
  );
  return result.lastID; // ID dodanego snacka
};

/**
 * Pobiera listę wszystkich snacków
 */
export const getAllSnacks = async () => {
  const db = getDb();
  const rows = await db.all(`SELECT * FROM snacks`);
  return rows;
};

/**
 * Pobiera pojedynczy snack po ID
 */
export const getSnackById = async (id) => {
  const db = getDb();
  const row = await db.get(`SELECT * FROM snacks WHERE id = ?`, [id]);
  return row;
};

/**
 * Aktualizuje snack
 * snackData: { name, price, quantity }
 */
export const updateSnack = async (id, snackData) => {
  const db = getDb();
  const { name, price, quantity } = snackData;
  await db.run(
    `UPDATE snacks
     SET name = ?, price = ?, quantity = ?
     WHERE id = ?`,
    [name, price, quantity, id]
  );
};

/**
 * Usuwa snack z bazy
 */
export const deleteSnack = async (id) => {
  const db = getDb();
  await db.run(`DELETE FROM snacks WHERE id = ?`, [id]);
};
