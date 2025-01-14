// backend/server.js
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config(); // wczytanie zmiennych z .env

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
