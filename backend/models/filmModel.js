// backend/models/filmModel.js
import { getDb } from './index.js';

export const createFilm = async (filmData) => {
  const db = getDb();
  const { title, description, genre, duration, posterUrl, trailerUrl } = filmData;
  const result = await db.run(
    `INSERT INTO films (title, description, genre, duration, posterUrl, trailerUrl)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, genre, duration, posterUrl, trailerUrl]
  );
  return result.lastID;
};

export const getAllFilms = async () => {
  const db = getDb();
  const films = await db.all(`SELECT * FROM films`);
  return films;
};

export const getFilmById = async (id) => {
  const db = getDb();
  const film = await db.get(`SELECT * FROM films WHERE id = ?`, [id]);
  return film;
};

// Edycja, usuwanie itd.:
export const updateFilm = async (id, filmData) => {
  const db = getDb();
  const { title, description, genre, duration, posterUrl, trailerUrl } = filmData;
  await db.run(
    `UPDATE films
     SET title = ?, description = ?, genre = ?, duration = ?, posterUrl = ?, trailerUrl = ?
     WHERE id = ?`,
    [title, description, genre, duration, posterUrl, trailerUrl, id]
  );
};

export const deleteFilm = async (id) => {
  const db = getDb();
  await db.run(`DELETE FROM films WHERE id = ?`, [id]);
};
