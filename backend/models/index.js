// backend/models/index.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db;

export const initDb = async (dbPath = './cinema.db') => {
    const resolvedPath = path.resolve(dbPath)
    db = await open({
    filename: resolvedPath,
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

  // Tabela rooms
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,   -- klucz główny
      roomNumber INTEGER,                     -- numer sali
      rowsCount INTEGER,
      colsCount INTEGER,
      layout TEXT,  -- JSON ze strefami vipRows itp.
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabela seances
  await db.exec(`
    CREATE TABLE IF NOT EXISTS seances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filmId INTEGER,
      roomId INTEGER,        -- klucz obcy do tabeli rooms(id)
      date DATE,
      startTime TIME,
      vipPrice REAL,
      normalPrice REAL,
      discountedPrice REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (filmId) REFERENCES films(id) ON DELETE CASCADE,
      FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE
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

  console.log('Database initialized with new tables (users, films, rooms, seances, tickets, snacks)');
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized! Call initDb() first.');
  }
  return db;
};
