// backend/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import filmRoutes from './routes/filmRoutes.js';
import seanceRoutes from './routes/seanceRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import snackRoutes from './routes/snackRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // Dodano paymentRoutes

const app = express();

app.use(cors());
app.use(express.json());

// Middleware logujące wszystkie przychodzące żądania
app.use((req, res, next) => {
  console.log(`app.js - Przychodzące żądanie: ${req.method} ${req.url}`);
  next();
});

// Główne ścieżki API
app.use('/api/auth', authRoutes);
console.log('app.js - Podłączono authRoutes na /api/auth');

app.use('/api/films', filmRoutes);
console.log('app.js - Podłączono filmRoutes na /api/films');

app.use('/api/seances', seanceRoutes);
console.log('app.js - Podłączono seanceRoutes na /api/seances');

app.use('/api/tickets', ticketRoutes);
console.log('app.js - Podłączono ticketRoutes na /api/tickets');

app.use('/api/rooms', roomRoutes);
console.log('app.js - Podłączono roomRoutes na /api/rooms');

app.use('/api/snacks', snackRoutes);
console.log('app.js - Podłączono snackRoutes na /api/snacks');

app.use('/api/users', userRoutes);
console.log('app.js - Podłączono userRoutes na /api/users');

app.use('/api/admin', adminRoutes);
console.log('app.js - Podłączono adminRoutes na /api/admin');

app.use('/api/payment', paymentRoutes);
console.log('app.js - Podłączono paymentRoutes na /api/payment');

// Testowe wywołanie na "/"
app.get('/', (req, res) => {
  res.send('Hello from Express 5! This is the Cinema App backend.');
});

export default app;
