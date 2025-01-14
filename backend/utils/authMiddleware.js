// backend/utils/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'test123';

// Middleware sprawdzający, czy użytkownik ma prawidłowy token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];  // np. "Bearer eyJhbGciOi..."
    if (!authHeader) {
      return res.status(401).json({ error: 'Brak tokenu autoryzacji' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Nieprawidłowy format nagłówka Authorization' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Nieprawidłowy lub wygasły token' });
      }
      // Zapiszmy userId i role w req.user:
      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };
      next();
    });
  } catch (error) {
    console.error('verifyToken error:', error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Middleware sprawdzający, czy użytkownik ma rolę "admin"
export const isAdmin = (req, res, next) => {
  // Zakładamy, że verifyToken został wywołany wcześniej
  // i mamy dostęp do req.user.role.
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Brak dostępu - musisz być administratorem' });
  }
  next();
};
