import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

function FilmDetailsPage() {
  const { filmId } = useParams();
  const [film, setFilm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Pobieramy info o filmie
    fetch(`http://localhost:3001/api/films/${filmId}`)
      .then((res) => res.json())
      .then((data) => setFilm(data))
      .catch((err) => console.error(err));
  }, [filmId]);

  const handleBuyTicket = () => {
    // Przechodzimy do widoku seansów dla danego filmu
    navigate(`/select-seance/${filmId}`);
  };

  if (!film) return <div>Ładowanie...</div>;

  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <img
          src={film.posterUrl || 'https://via.placeholder.com/200x300?text=No+Poster'}
          alt={film.title}
          style={{ width: 200, height: 300 }}
        />
        <Box>
          <Typography variant="h4">{film.title}</Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {film.description}
          </Typography>
          <Typography variant="subtitle1">
            Gatunek: {film.genre}, Czas: {film.duration} min
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleBuyTicket}>
            Kup bilet
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default FilmDetailsPage;
