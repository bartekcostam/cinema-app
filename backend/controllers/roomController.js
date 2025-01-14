// backend/controllers/roomController.js
import { createRoom, getAllRooms, getRoomById } from '../models/roomModel.js';

export const addRoom = async (req, res) => {
  try {
    const { roomNumber, rowsCount, colsCount, layout } = req.body;
    const newRoomId = await createRoom({ roomNumber, rowsCount, colsCount, layout });
    res.status(201).json({ message: 'Sala dodana pomyślnie', roomId: newRoomId });
  } catch (error) {
    console.error('addRoom error:', error);
    res.status(500).json({ error: 'Błąd serwera przy dodawaniu sali' });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.json(rooms);
  } catch (error) {
    console.error('getRooms error:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu sal' });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Sala nie znaleziona' });
    }
    res.json(room);
  } catch (error) {
    console.error('getRoom error:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu konkretnej sali' });
  }
};
