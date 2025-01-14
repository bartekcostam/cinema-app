import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; // biblioteka wchodząca w skład sqlite, ułatwia async/await

// UWAGA: w package.json musi być "type": "module",
//        dzięki temu możemy używać import ... from ...

let db;

export const initDb = async () => {
  // Otwieramy/zakładamy plik bazy (np. cinema.db)
  db = await open({
    filename: './cinema.db',
    driver: sqlite3.Database,
  });

  // Przykład utworzenia tabeli 'users' (o ile nie istnieje):
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',  -- może być 'user' lub 'admin'
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // W przyszłości dołożymy kolejne tabele, np. films, seances, tickets itd.
  console.log('Database initialized (users table ready)');
};

export const getDb = () => {
  // Zwracamy naszą instancję bazy
  if (!db) {
    throw new Error('Database not initialized! Call initDb() first.');
  }
  return db;
};
