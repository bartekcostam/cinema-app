// backend/controllers/userController.js
import {
  getUserById,
  updateUser,
  getAllUsersFromDb,
  updateUserAdmin,
  deleteUserFromDb
} from '../models/userModel.js';

/**
 * GET /api/users/me
 * Zwraca dane zalogowanego użytkownika (bez hasła).
 */
export const getProfile = async (req, res) => {
  try {
    // Poprawione odwołanie do userId
    const userId = req.user.userId;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie istnieje' });
    }

    // Nie wysyłamy hasła
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

/**
 * PUT /api/users/me
 * Aktualizuje dane zalogowanego użytkownika.
 */
export const updateProfile = async (req, res) => {
  try {
    // Poprawione odwołanie do userId
    const userId = req.user.userId;
    const { firstName, lastName } = req.body;

    // Walidacja wstępna
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'Brak wymaganych pól' });
    }

    // Aktualizacja danych użytkownika
    await updateUser(userId, { firstName, lastName });

    // Pobranie zaktualizowanego użytkownika
    const updatedUser = await getUserById(userId);
    const { password, ...userData } = updatedUser;
    res.json(userData);
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Błąd serwera przy aktualizacji profilu' });
  }
};

// Inne kontrolery pozostają bez zmian
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await deleteUserFromDb(userId);
    res.json({ message: 'Usunięto użytkownika' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ error: 'Błąd serwera przy usuwaniu usera' });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body; // np. { role: 'admin' } lub 'user'
    await updateUserAdmin(userId, { role });
    const updated = await getUserById(userId);
    if (!updated) {
      return res.status(404).json({ error: 'Nie znaleziono użytkownika' });
    }
    res.json(updated);
  } catch (error) {
    console.error('updateUserByAdmin error:', error);
    res.status(500).json({ error: 'Błąd serwera przy aktualizacji usera' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromDb();
    res.json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu użytkowników' });
  }
};
