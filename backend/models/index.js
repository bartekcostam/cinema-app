// backend/models/index.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export const initDb = async () => {
  db = await open({
    filename: './cinema.db',
    driver: sqlite3.Database,
  });

  // Tabela users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabela films
  await db.exec(`
    CREATE TABLE IF NOT EXISTS films (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      genre TEXT,
      duration INTEGER,
      posterUrl TEXT,
      trailerUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabela seances
  await db.exec(`
    CREATE TABLE IF NOT EXISTS seances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filmId INTEGER,
      date DATE,
      startTime TIME,
      roomNumber INTEGER,
      vipPrice REAL,
      normalPrice REAL,
      discountedPrice REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (filmId) REFERENCES films(id) ON DELETE CASCADE
    );
  `);

  // Tabela tickets
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      seanceId INTEGER,
      seatNumber TEXT,
      ticketType TEXT,
      price REAL,
      status TEXT DEFAULT 'reserved',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (seanceId) REFERENCES seances(id)
    );
  `);

  // Tabela snacks
  await db.exec(`
    CREATE TABLE IF NOT EXISTS snacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database initialized with new tables (users, films, seances, tickets, snacks)');
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized! Call initDb() first.');
  }
  return db;
};
