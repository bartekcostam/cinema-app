import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Podpinamy /api/auth
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Express 5! This is the Cinema App backend.');
});

export default app;
