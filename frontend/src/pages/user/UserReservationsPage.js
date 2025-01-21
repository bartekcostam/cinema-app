// frontend/src/pages/user/UserReservationsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/tickets/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.status}`);
        }

        const data = await response.json();
        console.log('Rezerwacje użytkownika:', data);
        setReservations(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu rezerwacji:', error);
        alert('Nie udało się pobrać rezerwacji.');
      }
    };

    fetchReservations();
  }, [navigate]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Twoje Rezerwacje
      </Typography>
      {reservations.length === 0 ? (
        <Typography>Nie masz żadnych rezerwacji.</Typography>
      ) : (
        reservations.map(reservation => (
          <Box key={reservation.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
            <Typography variant="h6">{reservation.filmTitle}</Typography>
            <Typography>Data: {reservation.date}</Typography>
            <Typography>Godzina: {reservation.startTime}</Typography>
            <Typography>Numer Miejsca: {reservation.seatNumber}</Typography>
            <Typography>Typ Biletu: {reservation.ticketType}</Typography>
            <Typography>Cena: {reservation.price} zł</Typography>
            <Typography>Status: {reservation.status}</Typography>
          </Box>
        ))
      )}
    </Container>
  );
}

export default UserReservationsPage;
