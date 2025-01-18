// frontend/src/pages/RepertuarPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RepertuarPage() {
  const [films, setFilms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/films')
      .then((res) => res.json())
      .then((data) => setFilms(data))
      .catch((err) => console.error(err));
  }, []);

  const handleBuyTicket = (filmId) => {
    // Np. przenosimy do /film/:filmId lub /select-seance?filmId=...
    navigate(`/film/${filmId}`);
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Repertuar - Nasze Filmy
      </Typography>
      <Grid container spacing={2}>
        {films.map((film) => (
          <Grid item xs={12} sm={6} md={4} key={film.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={film.posterUrl || 'https://via.placeholder.com/200x300?text=No+Poster'}
                alt={film.title}
                sx={{ height: 300 }}
              />
              <CardContent>
                <Typography variant="h6">{film.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gatunek: {film.genre} | Czas: {film.duration} min
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto' }}>
                <Button size="small" onClick={() => handleBuyTicket(film.id)}>
                  Kup bilet
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default RepertuarPage;
