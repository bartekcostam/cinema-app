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
  const [seance, setSeance] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetchSeance();
    fetchOccupiedSeats();
    // eslint-disable-next-line
  }, [seanceId]);

  const fetchSeance = () => {
    fetch(`http://localhost:3001/api/seances/${seanceId}`)
      .then((res) => res.json())
      .then((data) => {
        setSeance(data);
      })
      .catch((err) => console.error(err));
  };

  const fetchOccupiedSeats = () => {
    const token = localStorage.getItem('token');
    console.log('SeatSelectionPage.js - Pobieram zajęte miejsca z /api/tickets z tokenem:', token);

    fetch(`http://localhost:3001/api/tickets?seanceId=${seanceId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then((res) => {
        console.log('SeatSelectionPage.js - Odpowiedź /api/tickets?seanceId= status:', res.status);
        return res.json();
      })
      .then((tickets) => {
        console.log('SeatSelectionPage.js - Dane biletów (zajęte miejsca):', tickets);
        if (Array.isArray(tickets)) {
          const occ = tickets.map((t) => t.seatNumber);
          setOccupiedSeats(occ);
        } else {
          console.warn('SeatSelectionPage.js - Błąd pobierania zajętych miejsc:', tickets);
        }
      })
      .catch((error) => {
        console.error('SeatSelectionPage.js - Błąd fetchOccupiedSeats:', error);
      });
  };

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return; // zablokuj klik na zajęte
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  const handleReservation = () => {
    alert('Tutaj logika rezerwacji z osobnej strony SeatSelectionPage...');
  };

  if (!seance) return <div>Ładowanie...</div>;

  const { roomNumber, rowsCount, colsCount, layout } = seance;
  let parsedLayout = {};
  try {
    parsedLayout = layout ? JSON.parse(layout) : {};
  } catch (err) {
    console.error('Error parsing layout:', err);
  }

  const vipRows = parsedLayout.vipRows || [];
  const frontRows = parsedLayout.frontRows || [];

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
      if (isVIP) bg = '#ffb74d';  // VIP (pomarańcz)
      if (isFront) bg = '#81d4fa'; // front (jasny niebieski)
      if (isOccupied) bg = '#e57373'; // czerwony odcień na zajęte
      if (isSelected) bg = '#66bb6a'; // zielony na wybrane

      rowElements.push(
        <Tooltip
          key={seatId}
          title={`Rząd ${r}, Miejsce ${c} (${isVIP ? 'VIP' : isFront ? 'Front' : 'Standard'})`}
        >
          <Box
            onClick={() => handleSeatClick(seatId)}
            sx={{
              width: 24,
              height: 24,
              m: 0.5,
              backgroundColor: bg,
              cursor: isOccupied ? 'not-allowed' : 'pointer',
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
        Sala {roomNumber}
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
