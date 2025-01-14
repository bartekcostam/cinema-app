import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import filmRoutes from './routes/filmRoutes.js';
import seanceRoutes from './routes/seanceRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import snackRoutes from './routes/snackRoutes.js';





const app = express();

app.use(cors());
app.use(express.json());

// Podpinamy /api/auth
app.use('/api/auth', authRoutes);

app.use('/api/films', filmRoutes);

app.use('/api/seances', seanceRoutes);
app.use('/api/tickets', ticketRoutes);

app.use('/api/rooms', roomRoutes);

app.use('/api/snacks', snackRoutes);



app.get('/', (req, res) => {
  res.send('Hello from Express 5! This is the Cinema App backend.');
});

export default app;
