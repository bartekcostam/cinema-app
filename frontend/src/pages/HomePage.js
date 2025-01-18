// frontend/src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function HomePage() {
  const [films, setFilms] = useState([]);
  const navigate = useNavigate();

  // Ustawienia karuzeli
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  // Po załadowaniu pobieramy listę filmów z backendu
  useEffect(() => {
    fetch('http://localhost:3001/api/films')
      .then((res) => res.json())
      .then((data) => {
        setFilms(data);
      })
      .catch((err) => console.error('Błąd pobierania filmów:', err));
  }, []);

  const goToRepertuar = () => {
    navigate('/repertuar');
  };

  const goToFilmDetails = (filmId) => {
    // Możesz mieć np. /film/:id
    navigate(`/film/${filmId}`);
  };

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      {/* Sekcja baneru */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          p: 4,
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Witamy w naszym Kinie!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Sprawdź nowości i kup bilet już teraz
        </Typography>
        <Button variant="contained" color="primary" onClick={goToRepertuar}>
          Kup bilet
        </Button>
      </Box>

      {/* Sekcja karuzeli filmów */}
      <Typography variant="h5" gutterBottom>
        Nasze filmy
      </Typography>
      <Slider {...settings}>
        {films.map((film) => (
          <Box key={film.id} sx={{ px: 1 }}>
            <Box
              sx={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => goToFilmDetails(film.id)}
            >
              <img
                src={film.posterUrl || 'https://via.placeholder.com/200x300?text=No+Poster'}
                alt={film.title}
                style={{ width: '100%', borderRadius: 8 }}
              />
              {/* Możesz dodać overlay z tytułem */}
            </Box>
            <Typography variant="subtitle1" textAlign="center" sx={{ mt: 1 }}>
              {film.title}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default HomePage;
