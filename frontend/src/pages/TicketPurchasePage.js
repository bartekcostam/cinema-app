// frontend/src/pages/user/TicketPurchasePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SeatSelectionModal from './components/SeatSelectionModal';

function TicketPurchasePage() {
  const { seanceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [seance, setSeance] = useState(null);
  const [film, setFilm] = useState(null);

  // Lista zajętych miejsc w bazie
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  // Wybrane bilety i przekąski
  const [tickets, setTickets] = useState([]);
  const [snacks, setSnacks] = useState([
    { name: 'Popcorn', price: 10, quantity: 0 },
    { name: 'Cola', price: 8, quantity: 0 },
    { name: 'Hot-dog', price: 12, quantity: 0 },
  ]);

  // Modal do wyboru miejsc
  const [showModal, setShowModal] = useState(false);
  const [modalTicketIndex, setModalTicketIndex] = useState(null);

  // Pobieranie listy zajętych miejsc
  const fetchOccupiedSeats = async () => {
    try {
      console.log('TicketPurchasePage - Fetching occupied seats for seanceId:', seanceId);
      const token = localStorage.getItem('token');
      console.log('TicketPurchasePage - token (do pobierania zajętych miejsc):', token);

      const ticketsRes = await fetch(`http://localhost:3001/api/tickets?seanceId=${seanceId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      console.log('TicketPurchasePage - Response from /api/tickets?seanceId=:', ticketsRes.status);

      if (!ticketsRes.headers.get('Content-Type')?.includes('application/json')) {
        throw new Error('Odpowiedź nie jest w formacie JSON');
      }
      const ticketsData = await ticketsRes.json();
      console.log('TicketPurchasePage - Tickets data:', ticketsData);

      if (Array.isArray(ticketsData)) {
        const seats = ticketsData.map((t) => t.seatNumber);
        console.log('TicketPurchasePage - Occupied seats:', seats);
        setOccupiedSeats(seats);
      } else {
        console.warn('TicketPurchasePage - Błąd pobierania zajętych miejsc:', ticketsData);
      }
    } catch (err) {
      console.error('TicketPurchasePage - Błąd pobierania zajętych miejsc:', err);
    }
  };

  // useEffect do pobrania seansu, filmu i stanu z localStorage
  useEffect(() => {
    if (!seanceId) return;

    const fetchSeanceAndFilm = async () => {
      try {
        console.log('TicketPurchasePage - Fetching seance:', seanceId);
        const seanceRes = await fetch(`http://localhost:3001/api/seances/${seanceId}`);
        console.log('TicketPurchasePage - Response from /api/seances/:id status:', seanceRes.status);
        if (!seanceRes.ok) throw new Error(`Błąd serwera: ${seanceRes.status}`);
        const seanceData = await seanceRes.json();
        console.log('TicketPurchasePage - Seance data:', seanceData);
        setSeance(seanceData);

        const filmRes = await fetch(`http://localhost:3001/api/films/${seanceData.filmId}`);
        console.log('TicketPurchasePage - Response from /api/films/:id status:', filmRes.status);
        if (!filmRes.ok) throw new Error(`Błąd serwera: ${filmRes.status}`);
        const filmData = await filmRes.json();
        console.log('TicketPurchasePage - Film data:', filmData);
        setFilm(filmData);
      } catch (err) {
        console.error('Błąd pobierania seansu/filmu:', err);
      }
    };

    fetchSeanceAndFilm();
    fetchOccupiedSeats();

    // Wczytujemy stan z localStorage
    const saved = localStorage.getItem('ticketPurchase');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.seanceId === seanceId) {
        setTickets(parsed.tickets || []);
        setSnacks(parsed.snacks || []);
        console.log('TicketPurchasePage - Loaded tickets and snacks from localStorage:', parsed);
      }
    }
    // eslint-disable-next-line
  }, [seanceId]);

  // Zapis stanu do localStorage
  const savePurchaseState = () => {
    const obj = {
      seanceId,
      tickets,
      snacks
    };
    localStorage.setItem('ticketPurchase', JSON.stringify(obj));
    console.log('TicketPurchasePage - Saved purchase state to localStorage:', obj);
  };

  // Dodawanie biletu
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
    console.log(`TicketPurchasePage - Added ticket: type=${backendType}, price=${basePrice}`);
  };

  // Modal do wyboru miejsc
  const openSeatModal = (index) => {
    setModalTicketIndex(index);
    setShowModal(true);
    console.log(`TicketPurchasePage - Opening seat modal for ticket index: ${index}`);
  };
  const closeSeatModal = () => {
    setShowModal(false);
    setModalTicketIndex(null);
    console.log('TicketPurchasePage - Closing seat modal');
  };
  const handleSeatSelected = (seatInfo) => {
    const updated = [...tickets];
    updated[modalTicketIndex].seat = seatInfo.seatId;
    if (seatInfo.isVip) {
      updated[modalTicketIndex].price += 5;
    }
    setTickets(updated);
    console.log(`TicketPurchasePage - Selected seat for ticket index ${modalTicketIndex}:`, seatInfo);
    closeSeatModal();
  };

  // Obsługa snacków
  const handleSnackChange = (index, quantity) => {
    const updated = [...snacks];
    updated[index].quantity = quantity;
    setSnacks(updated);
    console.log(`TicketPurchasePage - Updated snack ${updated[index].name} quantity to ${quantity}`);
  };

  // Podsumowanie kosztów (z formatowaniem do 2 miejsc po przecinku)
  const totalTicketsCostNumber = tickets.reduce((acc, t) => acc + t.price, 0);
  const totalSnacksCostNumber = snacks.reduce((acc, s) => acc + (s.price * s.quantity), 0);
  const totalCostNumber = totalTicketsCostNumber + totalSnacksCostNumber;

  // Rezerwacja (POST /api/tickets)
  const handleReservation = async () => {
    console.log('TicketPurchasePage - handleReservation wywołane');
    const token = localStorage.getItem('token');
    if (!token) {
      // niezalogowany -> zapisz stan i przekieruj do logowania
      savePurchaseState();
      console.log('TicketPurchasePage - Nie zalogowany, przekierowanie do logowania');
      navigate('/login', { state: { from: location } });
      return;
    }

    const payloadTickets = tickets.map((t) => ({
      seatNumber: t.seat,
      ticketType: t.type
    }));
    console.log('TicketPurchasePage - Payload tickets:', payloadTickets);

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
      console.log('TicketPurchasePage - Response status from /api/tickets:', res.status);
      if (!res.ok) {
        const errorData = await res.json();
        console.error('TicketPurchasePage - Error response:', errorData);
        throw new Error(errorData.error || 'Rezerwacja nie powiodła się');
      }
      const data = await res.json();
      console.log('TicketPurchasePage - Reservation response:', data);
      alert(data.message || 'Rezerwacja OK!');

      // czyścimy localStorage
      localStorage.removeItem('ticketPurchase');
      console.log('TicketPurchasePage - Removed ticketPurchase from localStorage');
      navigate('/payment');

      // odśwież zajęte miejsca
      await fetchOccupiedSeats();
    } catch (err) {
      console.error('TicketPurchasePage - handleReservation error:', err);
      alert(err.message);
    }
  };

  // Płatność (też POST /api/tickets, żeby faktycznie utworzyć bilety)
  const handlePayment = async () => {
    console.log('TicketPurchasePage - handlePayment wywołane');
    const token = localStorage.getItem('token');
    if (!token) {
      savePurchaseState();
      console.log('TicketPurchasePage - Nie zalogowany, przekierowanie do logowania');
      navigate('/login', { state: { from: location } });
      return;
    }

    const payloadTickets = tickets.map((t) => ({
      seatNumber: t.seat,
      ticketType: t.type
    }));
    console.log('TicketPurchasePage - Payload tickets (payment path):', payloadTickets);

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
      console.log('TicketPurchasePage - Response status from /api/tickets (payment):', res.status);
      if (!res.ok) {
        const errorData = await res.json();
        console.error('TicketPurchasePage - handlePayment error response:', errorData);
        throw new Error(errorData.error || 'Nie można kupić biletów');
      }
      const data = await res.json();
      console.log('TicketPurchasePage - handlePayment reservation response:', data);
      alert(data.message || 'Rezerwacja OK!');

      // Czyścimy localStorage
      localStorage.removeItem('ticketPurchase');
      console.log('TicketPurchasePage - Removed ticketPurchase from localStorage (payment)');

      // Przechodzimy do /payment
      navigate('/payment');

      // odśwież zajęte miejsca
      await fetchOccupiedSeats();
    } catch (err) {
      console.error('TicketPurchasePage - handlePayment error:', err);
      alert(err.message);
    }
  };

  if (!seance) {
    return <div>Ładowanie seansu...</div>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 3, px: 3 }}>
      {film && (
        <>
          <Typography variant="h4" gutterBottom>
            Kup bilet na: {film.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <img
              src={film.posterUrl || 'https://via.placeholder.com/200x300?text=Poster'}
              alt={film.title}
              style={{ width: 200, height: 300 }}
              onError={(e) => {
                console.log('TicketPurchasePage - Image load error, using placeholder');
                e.target.src = 'https://via.placeholder.com/200x300?text=No+Poster';
              }}
            />
            <Box>
              <Typography>Gatunek: {film.genre}</Typography>
              <Typography>Czas trwania: {film.duration} min</Typography>
              <Typography>Data seansu: {seance.date}</Typography>
              <Typography>Godzina: {seance.startTime}</Typography>
              <Typography>Sala: {seance.roomNumber}</Typography>
            </Box>
          </Box>
        </>
      )}

      {/* Dodawanie biletów */}
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

      {/* Lista wybranych biletów */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Wybrane bilety:</Typography>
        {tickets.map((ticket, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Typography>
              Bilet: {ticket.type} – Cena: {ticket.price.toFixed(2)} zł
              {ticket.seat ? ` (Miejsce: ${ticket.seat})` : ''}
            </Typography>
            <Button variant="text" onClick={() => openSeatModal(index)}>
              {ticket.seat ? 'Zmień miejsce' : 'Wybierz miejsce'}
            </Button>
          </Box>
        ))}
      </Box>

      {/* Sekcja z przekąskami - delikatnie inne tło */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#f8f8f8',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom>Dodaj przekąski:</Typography>
        {snacks.map((snack, i) => (
          <Box key={snack.name} sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Typography>
              {snack.name} ({snack.price} zł/szt.)
            </Typography>
            <TextField
              type="number"
              value={snack.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                handleSnackChange(i, val);
              }}
              sx={{ width: 60 }}
            />
          </Box>
        ))}
      </Box>

      {/* Podsumowanie z 2 miejscami po przecinku */}
      <Box sx={{ mt: 3 }}>
        <Typography>Suma za bilety: {totalTicketsCostNumber.toFixed(2)} zł</Typography>
        <Typography>Suma za snacki: {totalSnacksCostNumber.toFixed(2)} zł</Typography>
        <Typography variant="h5" sx={{ mt: 1 }}>
          Razem do zapłaty: {totalCostNumber.toFixed(2)} zł
        </Typography>
      </Box>

      {/* Przyciski akcji (mb:3 aby nie kleiło się do dołu) */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
        <Button variant="contained" onClick={handleReservation}>
          Zarezerwuj
        </Button>
        <Button variant="contained" color="success" onClick={handlePayment}>
          Zapłać
        </Button>
      </Box>

      {/* Modal do wyboru miejsc */}
      {showModal && (
        <SeatSelectionModal
          onClose={closeSeatModal}
          onSeatSelected={handleSeatSelected}
          occupiedSeats={occupiedSeats}
          vipRows={[4, 5]}
        />
      )}
    </Container>
  );
}

export default TicketPurchasePage;
