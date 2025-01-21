// backend/models/index.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Uzyskanie katalogu bieżącego pliku (jeśli używasz ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

/**
 * Inicjalizacja połączenia z bazą danych i tworzenie tabel, jeśli nie istnieją.
 * @param {string} dbPath - Ścieżka do pliku bazy danych.
 */
export const initDb = async (dbPath = '../cinema.db') => { // Zmieniono domyślną ścieżkę na '../cinema.db'
  try {
    const resolvedPath = path.resolve(__dirname, dbPath);
    db = await open({
      filename: resolvedPath,
      driver: sqlite3.Database,
    });

    console.log(`models/index.js - Połączono z bazą danych na ścieżce: ${resolvedPath}`);

    // Włączenie kluczy obcych
    await db.run(`PRAGMA foreign_keys = ON;`);
    console.log('models/index.js - Klucze obce włączone');

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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomNumber INTEGER,
        rowsCount INTEGER,
        colsCount INTEGER,
        layout TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela seances
    await db.exec(`
      CREATE TABLE IF NOT EXISTS seances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filmId INTEGER,
        roomId INTEGER,
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

    console.log('models/index.js - Baza danych zainicjalizowana z tabelami: users, films, rooms, seances, tickets, snacks');
  } catch (error) {
    console.error('models/index.js - Błąd podczas inicjalizacji bazy danych:', error);
    throw error;
  }
};

/**
 * Zwraca instancję bazy danych.
 * @returns {sqlite.Database} Instancja bazy danych.
 * @throws {Error} Jeśli baza danych nie została zainicjalizowana.
 */
export const getDb = () => {
  if (!db) {
    throw new Error('Baza danych nie została zainicjalizowana! Wywołaj initDb() najpierw.');
  }
  return db;
};
