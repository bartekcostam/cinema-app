// frontend/src/pages/TicketPurchasePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SeatSelectionModal from './components/SeatSelectionModal';

function TicketPurchasePage() {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // aby wiedzieć, skąd przychodzi user

  // Film info
  const [film, setFilm] = useState(null);

  // tickets: np. { type: 'normal'|'discounted'|'VIP', seat: '4-10', price: 25 }
  const [tickets, setTickets] = useState([]);
  const [snacks, setSnacks] = useState([
    { name: 'Popcorn', price: 10, quantity: 0 },
    { name: 'Cola', price: 8, quantity: 0 },
    { name: 'Hot-dog', price: 12, quantity: 0 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalTicketIndex, setModalTicketIndex] = useState(null);

  // Po wejściu na stronę, sprawdzamy czy jest w localStorage stan "ticketPurchase"
  useEffect(() => {
    // ewentualnie pobierz dane filmu z backendu:
    setFilm({
      id: filmId,
      title: 'Przykładowy Film',
      duration: 120,
      genre: 'Akcja',
      posterUrl: 'https://via.placeholder.com/200x300?text=Poster'
    });

    const saved = localStorage.getItem('ticketPurchase');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Upewnij się, że filmId się zgadza. Jeśli tak, wczytaj stan:
      if (parsed.filmId === filmId) {
        setTickets(parsed.tickets || []);
        setSnacks(parsed.snacks || []);
      }
    }
  }, [filmId]);

  // Funkcja zapisująca do localStorage
  const savePurchaseState = () => {
    const obj = {
      filmId,
      tickets,
      snacks
    };
    localStorage.setItem('ticketPurchase', JSON.stringify(obj));
  };

  // Dodanie biletu
  const addTicket = (frontendType) => {
    let backendType = 'normal';
    let basePrice = 25;

    if (frontendType === 'ulgowy') {
      backendType = 'discounted';
      basePrice = 18;
    } else if (frontendType === 'prezentowy') {
      backendType = 'VIP';
      basePrice = 30;
    }
    setTickets((prev) => [...prev, { type: backendType, seat: null, price: basePrice }]);
  };

  // Modal
  const openSeatModal = (index) => {
    setModalTicketIndex(index);
    setShowModal(true);
  };
  const closeSeatModal = () => {
    setShowModal(false);
    setModalTicketIndex(null);
  };
  const handleSeatSelected = (seatInfo) => {
    const updated = [...tickets];
    updated[modalTicketIndex].seat = seatInfo.seatId;
    if (seatInfo.isVip) {
      updated[modalTicketIndex].price *= 2;
    }
    setTickets(updated);
    closeSeatModal();
  };

  // Snacki
  const handleSnackChange = (index, quantity) => {
    const updated = [...snacks];
    updated[index].quantity = quantity;
    setSnacks(updated);
  };

  // Podsumowanie
  const totalTicketsCost = tickets.reduce((acc, t) => acc + t.price, 0);
  const totalSnacksCost = snacks.reduce((acc, s) => acc + s.price * s.quantity, 0);
  const totalCost = totalTicketsCost + totalSnacksCost;

  // Rezerwacja (wymusza logowanie)
  const handleReservation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // user nie jest zalogowany, zapisz stan i przekieruj do /login
      savePurchaseState();
      navigate('/login', { state: { from: location } });
      return;
    }

    // Mając token → POST /api/tickets
    const seanceId = 1;
    const payloadTickets = tickets.map((t) => ({
      seatNumber: t.seat,
      ticketType: t.type
    }));

    try {
      const res = await fetch('http://localhost:3001/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          seanceId,
          tickets: payloadTickets
        })
      });
      if (!res.ok) throw new Error('Rezerwacja nie powiodła się');
      const data = await res.json();
      alert(data.message || 'Rezerwacja OK!');

      // Po rezerwacji możesz usunąć stan z localStorage
      localStorage.removeItem('ticketPurchase');
      // Przechodzimy do payment
      navigate('/payment');
    } catch (err) {
      alert(err.message);
    }
  };

  // Przycisk "Zapłać" - np. skip rezerwacja? (Możesz dostosować logikę)
  const handlePayment = () => {
    // Również sprawdź logowanie, zapisz stan, ...
    const token = localStorage.getItem('token');
    if (!token) {
      savePurchaseState();
      navigate('/login', { state: { from: location } });
      return;
    }

    navigate('/payment');
  };

  return (
    <Container sx={{ mt: 3 }}>
      {film && (
        <>
          <Typography variant="h4" gutterBottom>
            Kup bilet na: {film.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <img
              src={film.posterUrl}
              alt={film.title}
              style={{ width: 200, height: 300 }}
            />
            <Box>
              <Typography>Gatunek: {film.genre}</Typography>
              <Typography>Czas trwania: {film.duration} min</Typography>
            </Box>
          </Box>
        </>
      )}

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={() => addTicket('normal')}>
          Dodaj bilet Normalny
        </Button>
        <Button variant="outlined" onClick={() => addTicket('ulgowy')}>
          Dodaj bilet Ulgowy
        </Button>
        <Button variant="outlined" onClick={() => addTicket('prezentowy')}>
          Dodaj bilet Prezentowy
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Wybrane bilety:</Typography>
        {tickets.map((ticket, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}
          >
            <Typography>
              Bilet: {ticket.type} — Cena: {ticket.price} zł
              {ticket.seat ? ` (Miejsce: ${ticket.seat})` : ''}
            </Typography>
            <Button variant="text" onClick={() => openSeatModal(index)}>
              {ticket.seat ? 'Zmień miejsce' : 'Wybierz miejsce'}
            </Button>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Dodaj przekąski:</Typography>
        {snacks.map((snack, i) => (
          <Box
            key={snack.name}
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}
          >
            <Typography>
              {snack.name} ({snack.price} zł/szt.)
            </Typography>
            <TextField
              type="number"
              value={snack.quantity}
              onChange={(e) =>
                handleSnackChange(i, parseInt(e.target.value) || 0)
              }
              sx={{ width: 60 }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body1">
          Suma za bilety: {totalTicketsCost} zł
        </Typography>
        <Typography variant="body1">
          Suma za snacki: {totalSnacksCost} zł
        </Typography>
        <Typography variant="h5" sx={{ mt: 1 }}>
          Razem do zapłaty: {totalCost} zł
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleReservation}>
          Zarezerwuj
        </Button>
        <Button variant="contained" color="success" onClick={handlePayment}>
          Zapłać
        </Button>
      </Box>

      {showModal && (
        <SeatSelectionModal
          onClose={closeSeatModal}
          onSeatSelected={handleSeatSelected}
          occupiedSeats={[]} // ewentualnie pobierz z backendu
          vipRows={[4,5]}
        />
      )}
    </Container>
  );
}

export default TicketPurchasePage;
