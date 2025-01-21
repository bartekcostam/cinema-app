// backend/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'test123'; // Powinieneś ustawić to w pliku .env

/**
 * POST /api/auth/register
 * Rejestruje nowego użytkownika.
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Podstawowa walidacja
    if (!firstName || !lastName || !email || !password) {
      console.log('register - Brak wymaganych pól');
      return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }

    // Sprawdzenie, czy email już istnieje
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('register - Email już w użyciu:', email);
      return res.status(400).json({ error: 'Email już w użyciu' });
    }

    // Hashowanie hasła
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tworzenie użytkownika
    const userId = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'user', // Domyślna rola
    });

    console.log('register - Utworzono użytkownika z id:', userId);

    res.status(201).json({
      message: 'Użytkownik zarejestrowany pomyślnie',
      userId,
    });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ error: 'Błąd serwera podczas rejestracji' });
  }
};

/**
 * POST /api/auth/login
 * Loguje użytkownika.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Podstawowa walidacja
    if (!email || !password) {
      console.log('login - Brak email lub hasła');
      return res.status(400).json({ error: 'Email i hasło są wymagane' });
    }

    // Znalezienie użytkownika po emailu
    const user = await getUserByEmail(email);
    if (!user) {
      console.log('login - Użytkownik nie znaleziony:', email);
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    // Porównanie haseł
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('login - Nieprawidłowe hasło dla użytkownika:', email);
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    // Tworzenie tokena JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token ważny przez 1 godzinę
    );

    console.log('login - Użytkownik zalogowany:', email);

    res.json({
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
    console.error('login error:', error);
    res.status(500).json({ error: 'Błąd serwera podczas logowania' });
  }
};
