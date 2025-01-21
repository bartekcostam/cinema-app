// backend/utils/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'test123';

// Middleware weryfikujący token JWT i ustawiający informacje o użytkowniku w req.user
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];  // np. "Bearer eyJhbGciOi..."
    if (!authHeader) {
      console.log('verifyToken - brak nagłówka Authorization');
      return res.status(401).json({ error: 'Brak tokenu autoryzacji' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      console.log('verifyToken - nieprawidłowy format nagłówka Authorization');
      return res.status(401).json({ error: 'Nieprawidłowy format nagłówka Authorization' });
    }

    const scheme = parts[0];
    const token = parts[1];

    if (!/^Bearer$/i.test(scheme)) {
      console.log('verifyToken - nieprawidłowy schemat Authorization');
      return res.status(401).json({ error: 'Nieprawidłowy format nagłówka Authorization' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('verifyToken - błąd weryfikacji tokena:', err.message);
        return res.status(403).json({ error: 'Nieprawidłowy lub wygasły token' });
      }

      // Ustawiamy userId i role w req.user:
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
      console.log('verifyToken - użytkownik zweryfikowany:', req.user);
      next();
    });
  } catch (error) {
    console.error('verifyToken error:', error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Middleware sprawdzający, czy użytkownik ma rolę "admin"
export const isAdmin = (req, res, next) => {
  console.log('isAdmin - sprawdzanie roli:', req.user.role);
  if (req.user?.role !== 'admin') {
    console.log('isAdmin - brak uprawnień admina');
    return res.status(403).json({ error: 'Brak dostępu - musisz być administratorem' });
  }
  next();
};
