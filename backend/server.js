// backend/server.js
import dotenv from 'dotenv';
import app from './app.js';
import { initDb } from './models/index.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    // Inicjalizujemy bazę danych (cinema.db w katalogu backend)
    await initDb(); // Nie przekazujemy parametrów, używa domyślnej ścieżki '../cinema.db'

    // Dopiero po inicjalizacji bazy uruchamiamy serwer
    app.listen(PORT, () => {
      console.log(`server.js - Serwer działa na porcie ${PORT}`);
    });
  } catch (error) {
    console.error('server.js - Błąd podczas inicjalizacji bazy danych:', error);
    process.exit(1); // Zakończenie procesu z kodem błędu
  }
})();
