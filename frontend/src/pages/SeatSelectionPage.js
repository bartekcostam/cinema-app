// frontend/src/pages/SeatSelectionPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Tooltip
} from '@mui/material';

function SeatSelectionPage() {
  const { seanceId } = useParams();

  // Dane o seansie
  const [seance, setSeance] = useState(null);
  // Miejsca zajęte
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  // Miejsca wybrane przez usera
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    // 1) Pobierz dane seansu (z salą i layoutem)
    fetch(`http://localhost:3001/api/seances/${seanceId}`)
      .then((res) => res.json())
      .then((data) => {
        setSeance(data);
        // 2) Pobierz zajęte miejsca
        return fetch(`http://localhost:3001/api/tickets?seanceId=${seanceId}`);
      })
      .then((res) => res.json())
      .then((tickets) => {
        const occ = tickets.map((t) => t.seatNumber);
        setOccupiedSeats(occ);
      })
      .catch((err) => console.error(err));
  }, [seanceId]);

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  const handleReservation = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        seanceId,
        tickets: selectedSeats.map((seat) => ({
          seatNumber: seat,
          // tu logika do ticketType, np. sprawdzamy czy row jest VIP itp.
          ticketType: 'normal'
        }))
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Rezerwacja nie powiodła się');
        return res.json();
      })
      .then((data) => {
        alert(data.message || 'Zarezerwowano!');
      })
      .catch((err) => alert(err.message));
  };

  if (!seance) {
    return <div>Ładowanie...</div>;
  }

  // W seance mamy: roomId, rowsCount, colsCount, layout (JSON), ...
  const { roomId, roomNumber, rowsCount, colsCount, layout } = seance;

  // layout może zawierać np. { "vipRows": [7,8], "frontRows": [1,2] }
  let parsedLayout = {};
  try {
    parsedLayout = layout ? JSON.parse(layout) : {};
  } catch (err) {
    console.error('Error parsing room layout:', err);
  }

  const vipRows = parsedLayout.vipRows || [];
  const frontRows = parsedLayout.frontRows || [];

  // Generujemy siatkę
  const seats = [];
  for (let r = 1; r <= rowsCount; r++) {
    const rowElements = [];
    for (let c = 1; c <= colsCount; c++) {
      const seatId = `${r}-${c}`;
      const isOccupied = occupiedSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);
      const isVIP = vipRows.includes(r);
      const isFront = frontRows.includes(r);

      let bg = '#ccc';
      if (isVIP) bg = '#ffb74d'; // VIP
      if (isFront) bg = '#81d4fa'; // front
      if (isOccupied) bg = '#e0e0e0';
      if (isSelected) bg = '#66bb6a';

      rowElements.push(
        <Tooltip
          key={seatId}
          title={`Rząd ${r}, Miejsce ${c} (${isVIP ? 'VIP' : isFront ? 'Front' : 'Standard'})`}
        >
          <Box
            onClick={() => handleSeatClick(seatId)}
            sx={{
              width: 24, height: 24,
              m: 0.5,
              backgroundColor: bg,
              cursor: isOccupied ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: isOccupied ? 'none' : 'scale(1.1)'
              }
            }}
          />
        </Tooltip>
      );
    }
    seats.push(
      <Box key={`row-${r}`} sx={{ display: 'flex' }}>
        {rowElements}
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Sala {roomNumber} – Seans {seance.date} {seance.startTime}
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'inline-block',
            width: colsCount * 26 + 'px',
            height: '20px',
            backgroundColor: '#000',
            color: '#fff',
            mb: 2
          }}
        >
          Ekran
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {seats}
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleReservation}
        disabled={selectedSeats.length === 0}
      >
        Zarezerwuj
      </Button>
    </Container>
  );
}

export default SeatSelectionPage;
