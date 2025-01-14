// backend/controllers/snackController.js

import {
    createSnack,
    getAllSnacks,
    getSnackById,
    updateSnack,
    deleteSnack,
  } from '../models/snackModel.js';
  
  /**
   * Tworzenie nowego snacka
   * [POST] /api/snacks
   */
  export const addSnack = async (req, res) => {
    try {
      const { name, price, quantity } = req.body;
      if (!name || !price) {
        return res.status(400).json({ error: 'Brak wymaganych pól (name, price)' });
      }
      const newSnackId = await createSnack({ name, price, quantity: quantity || 0 });
      res.status(201).json({ message: 'Snack utworzony', snackId: newSnackId });
    } catch (error) {
      console.error('addSnack error:', error);
      res.status(500).json({ error: 'Błąd serwera przy tworzeniu snacka' });
    }
  };
  
  /**
   * Pobieranie listy wszystkich snacków
   * [GET] /api/snacks
   */
  export const getSnacks = async (req, res) => {
    try {
      const snacks = await getAllSnacks();
      res.json(snacks);
    } catch (error) {
      console.error('getSnacks error:', error);
      res.status(500).json({ error: 'Błąd serwera przy pobieraniu snacków' });
    }
  };
  
  /**
   * Pobieranie pojedynczego snacka
   * [GET] /api/snacks/:id
   */
  export const getSingleSnack = async (req, res) => {
    try {
      const snack = await getSnackById(req.params.id);
      if (!snack) {
        return res.status(404).json({ error: 'Snack nie znaleziony' });
      }
      res.json(snack);
    } catch (error) {
      console.error('getSingleSnack error:', error);
      res.status(500).json({ error: 'Błąd serwera przy pobieraniu snacka' });
    }
  };
  
  /**
   * Aktualizacja snacka
   * [PUT] /api/snacks/:id
   */
  export const updateSnackCtrl = async (req, res) => {
    try {
      const { name, price, quantity } = req.body;
      await updateSnack(req.params.id, { name, price, quantity });
      res.json({ message: 'Snack zaktualizowany pomyślnie' });
    } catch (error) {
      console.error('updateSnackCtrl error:', error);
      res.status(500).json({ error: 'Błąd serwera przy aktualizacji snacka' });
    }
  };
  
  /**
   * Usuwanie snacka
   * [DELETE] /api/snacks/:id
   */
  export const deleteSnackCtrl = async (req, res) => {
    try {
      await deleteSnack(req.params.id);
      res.json({ message: 'Snack usunięty' });
    } catch (error) {
      console.error('deleteSnackCtrl error:', error);
      res.status(500).json({ error: 'Błąd serwera przy usuwaniu snacka' });
    }
  };
  