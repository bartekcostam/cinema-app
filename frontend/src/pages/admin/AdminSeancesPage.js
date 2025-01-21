// frontend/src/pages/admin/AdminSeancesPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  Button,
  Box
} from '@mui/material';

function AdminSeancesPage() {
  const [seances, setSeances] = useState([]);
  const [films, setFilms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newSeance, setNewSeance] = useState({
    filmId: '',
    roomId: '',
    date: '',
    startTime: '',
    vipPrice: 40,
    normalPrice: 30,
    discountedPrice: 20
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSeances();
    fetchFilms();
    fetchRooms();
  }, []);

  const fetchSeances = async () => {
    const res = await fetch('http://localhost:3001/api/seances', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setSeances(data);
  };
  const fetchFilms = async () => {
    const res = await fetch('http://localhost:3001/api/films');
    const data = await res.json();
    setFilms(data);
  };
  const fetchRooms = async () => {
    const res = await fetch('http://localhost:3001/api/rooms', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRooms(data);
  };

  const createSeance = async () => {
    const res = await fetch('http://localhost:3001/api/seances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        filmId: parseInt(newSeance.filmId),
        roomId: parseInt(newSeance.roomId),
        date: newSeance.date,
        startTime: newSeance.startTime,
        vipPrice: parseFloat(newSeance.vipPrice),
        normalPrice: parseFloat(newSeance.normalPrice),
        discountedPrice: parseFloat(newSeance.discountedPrice)
      })
    });
    if (res.ok) {
      alert('Seans dodany');
      setNewSeance({
        filmId: '',
        roomId: '',
        date: '',
        startTime: '',
        vipPrice: 40,
        normalPrice: 30,
        discountedPrice: 20
      });
      fetchSeances();
    } else {
      alert('Błąd dodawania seansu');
    }
  };

  const startEdit = (seance) => {
    setEditId(seance.seanceId);
    setEditData({
      filmId: seance.filmId,
      roomId: seance.roomId,
      date: seance.date,
      startTime: seance.startTime,
      vipPrice: seance.vipPrice,
      normalPrice: seance.normalPrice,
      discountedPrice: seance.discountedPrice
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    const res = await fetch(`http://localhost:3001/api/seances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        filmId: parseInt(editData.filmId),
        roomId: parseInt(editData.roomId),
        date: editData.date,
        startTime: editData.startTime,
        vipPrice: parseFloat(editData.vipPrice),
        normalPrice: parseFloat(editData.normalPrice),
        discountedPrice: parseFloat(editData.discountedPrice)
      })
    });
    if (res.ok) {
      alert('Zaktualizowano seans');
      setEditId(null);
      fetchSeances();
    } else {
      alert('Błąd aktualizacji seansu');
    }
  };

  const deleteSeance = async (id) => {
    if (!window.confirm('Usunąć seans?')) return;
    const res = await fetch(`http://localhost:3001/api/seances/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Seans usunięty');
      fetchSeances();
    } else {
      alert('Błąd usuwania seansu');
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5">Zarządzanie seansami</Typography>

      {/* Formularz dodawania nowego seansu */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
        <Select
          value={newSeance.filmId}
          onChange={(e) => setNewSeance((p) => ({ ...p, filmId: e.target.value }))}
          displayEmpty
          sx={{ width: 150 }}
        >
          <MenuItem value="">Film</MenuItem>
          {films.map((film) => (
            <MenuItem key={film.id} value={film.id}>
              {film.title}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={newSeance.roomId}
          onChange={(e) => setNewSeance((p) => ({ ...p, roomId: e.target.value }))}
          displayEmpty
          sx={{ width: 120 }}
        >
          <MenuItem value="">Sala</MenuItem>
          {rooms.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.roomNumber}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Data (YYYY-MM-DD)"
          type="date"
          value={newSeance.date}
          onChange={(e) => setNewSeance((p) => ({ ...p, date: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Godzina (HH:MM)"
          value={newSeance.startTime}
          onChange={(e) => setNewSeance((p) => ({ ...p, startTime: e.target.value }))}
        />
        <TextField
          label="VIP"
          value={newSeance.vipPrice}
          onChange={(e) => setNewSeance((p) => ({ ...p, vipPrice: e.target.value }))}
          sx={{ width: 70 }}
        />
        <TextField
          label="Normalny"
          value={newSeance.normalPrice}
          onChange={(e) => setNewSeance((p) => ({ ...p, normalPrice: e.target.value }))}
          sx={{ width: 70 }}
        />
        <TextField
          label="Ulgowy"
          value={newSeance.discountedPrice}
          onChange={(e) => setNewSeance((p) => ({ ...p, discountedPrice: e.target.value }))}
          sx={{ width: 70 }}
        />

        <Button variant="contained" onClick={createSeance}>
          Dodaj seans
        </Button>
      </Box>

      {/* Tabela seansów */}
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Film</TableCell>
            <TableCell>Sala</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Godzina</TableCell>
            <TableCell>VIP</TableCell>
            <TableCell>Normalny</TableCell>
            <TableCell>Ulgowy</TableCell>
            <TableCell>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seances.map((s) => (
            <TableRow key={s.seanceId}>
              <TableCell>{s.seanceId}</TableCell>
              <TableCell>{s.title}</TableCell>
              <TableCell>{s.roomNumber}</TableCell>
              {editId === s.seanceId ? (
                <>
                  <TableCell>
                    <TextField
                      name="date"
                      value={editData.date}
                      onChange={handleEditChange}
                      sx={{ width: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="startTime"
                      value={editData.startTime}
                      onChange={handleEditChange}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="vipPrice"
                      value={editData.vipPrice}
                      onChange={handleEditChange}
                      sx={{ width: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="normalPrice"
                      value={editData.normalPrice}
                      onChange={handleEditChange}
                      sx={{ width: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="discountedPrice"
                      value={editData.discountedPrice}
                      onChange={handleEditChange}
                      sx={{ width: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => saveEdit(s.seanceId)}>
                      Zapisz
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{s.date}</TableCell>
                  <TableCell>{s.startTime}</TableCell>
                  <TableCell>{s.vipPrice.toFixed(2)}</TableCell>
                  <TableCell>{s.normalPrice.toFixed(2)}</TableCell>
                  <TableCell>{s.discountedPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => startEdit(s)}>
                      Edytuj
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ ml: 1 }}
                      onClick={() => deleteSeance(s.seanceId)}
                    >
                      Usuń
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default AdminSeancesPage;
