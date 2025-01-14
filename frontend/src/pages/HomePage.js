// frontend/src/pages/HomePage.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Slider from 'react-slick'; // z paczki react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function HomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  // Tymczasowe dane do slidera
  const slides = [
    {
      id: 1,
      title: 'Film 1',
      img: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: 2,
      title: 'Film 2',
      img: 'https://picsum.photos/400/300?random=2'
    },
    {
      id: 3,
      title: 'Film 3',
      img: 'https://picsum.photos/400/300?random=3'
    },
    {
      id: 4,
      title: 'Film 4',
      img: 'https://picsum.photos/400/300?random=4'
    },
    // ... itd.
  ];

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
        <Button variant="contained" color="primary">
          Kup bilet
        </Button>
      </Box>

      {/* Sekcja karuzeli filmów */}
      <Typography variant="h5" gutterBottom>
        Nasze filmy
      </Typography>
      <Slider {...settings}>
        {slides.map((slide) => (
          <Box key={slide.id} sx={{ px: 1 }}>
            <img
              src={slide.img}
              alt={slide.title}
              style={{ width: '100%', borderRadius: 8 }}
            />
            <Typography variant="subtitle1" textAlign="center">{slide.title}</Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default HomePage;
