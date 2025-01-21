// frontend/src/pages/SelectSeancePage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';

function SelectSeancePage() {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const [seances, setSeances] = useState([]);

  useEffect(() => {
    if (!filmId) return;

    fetch(`http://localhost:3001/api/seances?filmId=${filmId}`)
      .then((res) => res.json())
      .then((data) => {
        setSeances(data);
      })
      .catch((err) => console.error('Error:', err));
  }, [filmId]);

  const handleSeanceClick = (seanceId) => {
    navigate(`/ticket-purchase/${seanceId}`);
  };

  return (
    <Container sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>
        Wybierz seans
      </Typography>

      {seances.map((s) => (
        <Box
          key={s.seanceId}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mb: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#e0e0e0'
            }
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {s.date} | {s.startTime}
            </Typography>
            <Typography>Sala {s.roomNumber}</Typography>
          </Box>
          <Button variant="contained" onClick={() => handleSeanceClick(s.seanceId)}>
            Wybierz
          </Button>
        </Box>
      ))}
    </Container>
  );
}

export default SelectSeancePage;
