import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'test123'; // do .env

// [POST] /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Sprawdź, czy email już istnieje
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Użytkownik o takim email już istnieje' });
    }

    // Hash hasła
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Utwórz użytkownika
    const userId = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'user', // domyślnie
    });

    return res.status(201).json({
      message: 'Konto zostało utworzone pomyślnie',
      userId,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
};

// [POST] /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Znajdź usera w bazie
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    // Porównaj zahashowane hasła
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    // Stwórz token (JWT)
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' } // token ważny 1 godzinę
    );

    return res.json({
      message: 'Zalogowano pomyślnie',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
};
