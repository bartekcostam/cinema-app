import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Prosta trasa testowa
app.get('/', (req, res) => {
  res.send('Hello from Express 5!');
});

// Export, żeby np. użyć w plikach testowych
export default app;