import {
    createFilm,
    getAllFilms,
    getFilmById,
    updateFilm,
    deleteFilm,
  } from '../models/filmModel.js';
  
  // [POST] /api/films
  export const addFilm = async (req, res) => {
    try {
      const newFilmId = await createFilm(req.body);
      res.status(201).json({ message: 'Film dodany', id: newFilmId });
    } catch (error) {
      console.error('addFilm error:', error);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  };
  
  // [GET] /api/films
  export const getFilms = async (req, res) => {
    try {
      const films = await getAllFilms();
      res.json(films);
    } catch (error) {
      console.error('getFilms error:', error);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  };
  
  // [GET] /api/films/:id
  export const getFilm = async (req, res) => {
    try {
      const film = await getFilmById(req.params.id);
      if (!film) {
        return res.status(404).json({ error: 'Film nie znaleziony' });
      }
      res.json(film);
    } catch (error) {
      console.error('getFilm error:', error);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  };
  
  // [PUT] /api/films/:id
  export const updateFilmCtrl = async (req, res) => {
    try {
      await updateFilm(req.params.id, req.body);
      res.json({ message: 'Zaktualizowano film' });
    } catch (error) {
      console.error('updateFilmCtrl error:', error);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  };
  
  // [DELETE] /api/films/:id
  export const deleteFilmCtrl = async (req, res) => {
    try {
      await deleteFilm(req.params.id);
      res.json({ message: 'Usunięto film' });
    } catch (error) {
      console.error('deleteFilmCtrl error:', error);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  };
  