// frontend/src/pages/SelectSeancePage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, Button } from '@mui/material';

function SelectSeancePage() {
  const { filmId } = useParams();  // np. /select-seance/:filmId
  const navigate = useNavigate();
  const [seances, setSeances] = useState([]);

  useEffect(() => {
    // Pobieramy seanse dla danego filmu
    fetch(`http://localhost:3001/api/seances?filmId=${filmId}`)
      .then((res) => res.json())
      .then((data) => {
        setSeances(data);
      })
      .catch((err) => console.error('Error:', err));
  }, [filmId]);

  const handleSeanceClick = (seanceId) => {
    // Przechodzimy do widoku wyboru miejsc
    navigate(`/seat-selection/${seanceId}`);
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Wybierz seans
      </Typography>
      <List>
        {seances.map((s) => (
          <ListItem key={s.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <Typography variant="subtitle1">
              {s.date} | {s.startTime} | Sala {s.roomNumber}
            </Typography>
            <Button variant="contained" onClick={() => handleSeanceClick(s.id)}>
              Wybierz
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default SelectSeancePage;
