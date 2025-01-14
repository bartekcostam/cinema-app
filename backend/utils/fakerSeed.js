/**
 * Rozbudowany skrypt seedujący bazę z użyciem menu interaktywnego.
 *
 * Uruchamianie: node utils/fakerSeed.js
 */

import inquirer from 'inquirer';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { initDb, getDb } from '../models/index.js';
import { createUser } from '../models/userModel.js';
import { createFilm } from '../models/filmModel.js';
import { createSeance } from '../models/seanceModel.js';
import { createSnack } from '../models/snackModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
(async () => {
  try {
    const dbPath = path.join(__dirname, '..', 'cinema.db');


    // 1) Inicjalizacja bazy (tworzy tabele, jeśli nie istnieją)
    await initDb(dbPath);
    const db = getDb();
    console.log('Database initialized.');

    // 2) Menu interaktywne
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'menuOption',
        message: 'Co chcesz zrobić?',
        choices: [
          { name: '1) Wyczyść (usunąć) wszystkie tabele', value: 'clearAll' },
          { name: '2) Załaduj TYLKO userów (admin & user)', value: 'loadUsers' },
          { name: '3) Załaduj TYLKO filmy (Faker)', value: 'loadFilms' },
          { name: '4) Załaduj TYLKO seanse (Faker)', value: 'loadSeances' },
          { name: '5) Załaduj TYLKO snacki (Faker)', value: 'loadSnacks' },
          { name: '6) Załaduj WSZYSTKO', value: 'loadAll' },
          { name: 'Wyjście (nie robić nic)', value: 'exit' },
        ],
      },
    ]);

    switch (answer.menuOption) {
      case 'clearAll':
        await clearAllTables(db);
        console.log('--- Wszystkie tabele wyczyszczone! ---');
        break;

      case 'loadUsers':
        await clearUsers(db);
        await seedUsers(db);
        break;

      case 'loadFilms':
        await clearFilms(db);
        await seedFilms(db);
        break;

      case 'loadSeances':
        await clearSeances(db);
        await seedSeances(db);
        break;

      case 'loadSnacks':
        await clearSnacks(db);
        await seedSnacks(db);
        break;

      case 'loadAll':
        // Najpierw czyścimy wszystko, aby uniknąć konfliktów
        await clearAllTables(db);
        // Następnie seedujemy w kolejności: userzy, filmy, seanse, snacki
        await seedUsers(db);
        await seedFilms(db);
        await seedSeances(db);
        await seedSnacks(db);
        break;

      case 'exit':
      default:
        console.log('Zakończono bez zmian.');
        break;
    }

    console.log('Done.');
  } catch (error) {
    console.error('FAKER SEED ERROR:', error);
  } finally {
    process.exit();
  }
})();

/* 
  -----------------------
  FUNKCJE CZYSZCZĄCE
  -----------------------
*/
async function clearAllTables(db) {
  await db.exec('DELETE FROM tickets;');
  await db.exec('DELETE FROM seances;');
  await db.exec('DELETE FROM rooms;');
  await db.exec('DELETE FROM films;');
  await db.exec('DELETE FROM snacks;');
  await db.exec('DELETE FROM users;');

  // Reset ID (AUTOINCREMENT) w SQLite
  await db.exec("DELETE FROM sqlite_sequence WHERE name IN ('tickets','seances','rooms','films','snacks','users');");

  console.log('[CLEAR] Wyczyszczono wszystkie tabele');
}

async function clearUsers(db) {
  await db.exec('DELETE FROM users;');
  await db.exec("DELETE FROM sqlite_sequence WHERE name='users';");
  console.log('[CLEAR] Wyczyszczono tabelę users');
}
async function clearFilms(db) {
  await db.exec('DELETE FROM films;');
  await db.exec("DELETE FROM sqlite_sequence WHERE name='films';");
  console.log('[CLEAR] Wyczyszczono tabelę films');
}
async function clearSeances(db) {
  await db.exec('DELETE FROM seances;');
  await db.exec('DELETE FROM rooms;');  // bo w seedSeances tworzymy rooms, jeśli nie ma
  await db.exec("DELETE FROM sqlite_sequence WHERE name='seances';");
  await db.exec("DELETE FROM sqlite_sequence WHERE name='rooms';");
  console.log('[CLEAR] Wyczyszczono tabele seances i rooms');
}
async function clearSnacks(db) {
  await db.exec('DELETE FROM snacks;');
  await db.exec("DELETE FROM sqlite_sequence WHERE name='snacks';");
  console.log('[CLEAR] Wyczyszczono tabelę snacks');
}

/*
  -----------------------
  FUNKCJE SEEDUJĄCE
  -----------------------
*/

// 1) Użytkownicy: admin i user
async function seedUsers(db) {
  console.log('--- Tworzenie użytkowników testowych ---');

  const adminHash = await bcrypt.hash('admin', 10);
  await createUser({
    firstName: 'Admin',
    lastName: 'Testowy',
    email: 'admin@example.com',
    password: adminHash,
    role: 'admin',
  });

  const userHash = await bcrypt.hash('user', 10);
  await createUser({
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'user@example.com',
    password: userHash,
    role: 'user',
  });

  console.log('[SEED] Użytkownicy dodani (admin@example.com / user@example.com)');
}

// 2) Filmy
async function seedFilms(db) {
  console.log('--- Dodawanie przykładowych filmów ---');
  // Dodajmy 10 filmów
  for (let i = 0; i < 10; i++) {
    await createFilm({
      title: faker.lorem.words({ min: 2, max: 4 }),
      description: faker.lorem.sentences(2),
      genre: faker.helpers.arrayElement(['Horror', 'Komedia', 'Akcja', 'Thriller', 'Sci-Fi']),
      duration: faker.number.int({ min: 60, max: 180 }),
      posterUrl: faker.image.url({ width: 200, height: 300, category: 'movie', randomize: true }),
      trailerUrl: 'https://www.youtube.com/watch?v=XXXX',
    });
  }
  console.log('[SEED] Filmy dodane (10 szt.)');
}

// 3) Seanse (oraz sale, jeśli brak)
async function seedSeances(db) {
  console.log('--- Dodawanie przykładowych seansów ---');

  // Najpierw sprawdzamy, czy są sale (rooms)
  const existingRooms = await db.all('SELECT * FROM rooms');
  if (existingRooms.length === 0) {
    // Tworzymy 3 sale (roomNumber = 1, 2, 3). Kolumna 'id' autoincrement, więc się sama ustali.
    await db.run(`
      INSERT INTO rooms (roomNumber, rowsCount, colsCount, layout)
      VALUES (1, 8, 12, '{"vipRows":[7,8],"frontRows":[1,2]}')
    `);
    await db.run(`
      INSERT INTO rooms (roomNumber, rowsCount, colsCount, layout)
      VALUES (2, 10, 15, '{"vipRows":[9,10],"frontRows":[1,2]}')
    `);
    await db.run(`
      INSERT INTO rooms (roomNumber, rowsCount, colsCount, layout)
      VALUES (3, 12, 20, '{"vipRows":[10,11,12],"frontRows":[1,2,3]}')
    `);
    console.log('[SEED] Dodano 3 sale kinowe (roomNumber: 1, 2, 3)');
  }

  // Sprawdźmy filmy
  const films = await db.all('SELECT id FROM films');
  if (films.length === 0) {
    console.log('[SEED] Brak filmów! Najpierw załaduj filmy.');
    return;
  }

  // Tworzymy 10 seansów
  for (let i = 0; i < 10; i++) {
    const randomFilm = faker.helpers.arrayElement(films); 
    const randomFilmId = randomFilm.id;

    // Mamy w rooms id=1..3 i roomNumber=1..3
    // Ale do seances wstawiamy "roomId" = 1..3
    // (czyli zbieżne z ID w tabeli rooms)
    const randomRoomId = faker.number.int({ min: 1, max: 3 });

    const randomDate = faker.date.soon({ days: 30 });
    const dateStr = randomDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const startTime = faker.helpers.arrayElement(['10:00', '13:30', '15:00', '18:00', '20:30', '22:00']);

    // Ceny
    const vip = faker.number.float({ min: 35, max: 50, precision: 0.5 });
    const normal = vip - 10;
    const discount = normal - 5;

    // createSeance -> wstawi filmId, roomId, etc.
    await createSeance({
      filmId: randomFilmId,
      roomId: randomRoomId,
      date: dateStr,
      startTime,
      vipPrice: vip,
      normalPrice: normal,
      discountedPrice: discount,
    });
  }

  console.log('[SEED] Seanse dodane (10 szt.)');
}

// 4) Snacki
async function seedSnacks(db) {
  console.log('--- Dodawanie przykładowych snacków ---');

  const snackOptions = [
    'Popcorn duży',
    'Popcorn mały',
    'Coca-cola',
    'Fanta',
    'Nachosy',
    'Hot-dog',
    'Sok',
    'Woda mineralna'
  ];
  for (let i = 0; i < 7; i++) {
    const snackName = faker.helpers.arrayElement(snackOptions);
    snackOptions.splice(snackOptions.indexOf(snackName), 1);

    const snackPrice = faker.number.float({ min: 5, max: 15, precision: 0.5 });
    const snackQty = faker.number.int({ min: 10, max: 50 });

    await createSnack({
      name: snackName,
      price: snackPrice,
      quantity: snackQty,
    });
  }

  console.log('[SEED] Snacki dodane (7 szt.)');
}
