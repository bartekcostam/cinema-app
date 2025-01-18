// frontend/src/pages/admin/AdminFilmsPage.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Box } from '@mui/material';

function AdminFilmsPage() {
  const [films, setFilms] = useState([]);
  const [newFilm, setNewFilm] = useState({ title: '', description: '', genre: '', duration: '' });

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/films');
      const data = await res.json();
      setFilms(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateFilm = async () => {
    // Założenie: admin -> token w localStorage
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/api/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newFilm)
      });
      if (res.ok) {
        setNewFilm({ title: '', description: '', genre: '', duration: '' });
        fetchFilms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Zarządzanie filmami</Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label="Tytuł"
          value={newFilm.title}
          onChange={(e) => setNewFilm({ ...newFilm, title: e.target.value })}
        />
        <TextField
          label="Opis"
          value={newFilm.description}
          onChange={(e) => setNewFilm({ ...newFilm, description: e.target.value })}
        />
        <TextField
          label="Gatunek"
          value={newFilm.genre}
          onChange={(e) => setNewFilm({ ...newFilm, genre: e.target.value })}
        />
        <TextField
          label="Czas trwania"
          type="number"
          value={newFilm.duration}
          onChange={(e) => setNewFilm({ ...newFilm, duration: e.target.value })}
        />
        <Button variant="contained" onClick={handleCreateFilm}>
          Dodaj film
        </Button>
      </Box>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Tytuł</TableCell>
            <TableCell>Opis</TableCell>
            <TableCell>Gatunek</TableCell>
            <TableCell>Czas trwania</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {films.map((film) => (
            <TableRow key={film.id}>
              <TableCell>{film.title}</TableCell>
              <TableCell>{film.description}</TableCell>
              <TableCell>{film.genre}</TableCell>
              <TableCell>{film.duration} min</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default AdminFilmsPage;
