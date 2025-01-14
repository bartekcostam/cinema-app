import dotenv from 'dotenv';
import app from './app.js';
import { initDb } from './models/index.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    // Inicjalizujemy bazę
    await initDb();

    // Dopiero po inicjalizacji bazy uruchamiamy serwer
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing DB:', error);
    process.exit(1);
  }
})();
