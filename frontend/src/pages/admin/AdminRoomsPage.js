// frontend/src/pages/admin/AdminRoomsPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Box
} from '@mui/material';

function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    rowsCount: '',
    colsCount: '',
    layout: '{"vipRows":[7,8],"frontRows":[1,2]}'
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch('http://localhost:3001/api/rooms', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRooms(data);
  };

  const handleCreateRoom = async () => {
    const res = await fetch('http://localhost:3001/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        roomNumber: parseInt(newRoom.roomNumber),
        rowsCount: parseInt(newRoom.rowsCount),
        colsCount: parseInt(newRoom.colsCount),
        layout: newRoom.layout
      })
    });
    if (res.ok) {
      alert('Sala utworzona');
      setNewRoom({ roomNumber: '', rowsCount: '', colsCount: '', layout: '' });
      fetchRooms();
    } else {
      const err = await res.json();
      alert(err.error || 'Błąd tworzenia sali');
    }
  };

  const startEditing = (room) => {
    setEditingRoomId(room.id);
    setEditingData({
      roomNumber: room.roomNumber,
      rowsCount: room.rowsCount,
      colsCount: room.colsCount,
      layout: room.layout
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    const res = await fetch(`http://localhost:3001/api/rooms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        roomNumber: parseInt(editingData.roomNumber),
        rowsCount: parseInt(editingData.rowsCount),
        colsCount: parseInt(editingData.colsCount),
        layout: editingData.layout
      })
    });
    if (res.ok) {
      alert('Zaktualizowano salę');
      setEditingRoomId(null);
      fetchRooms();
    } else {
      const err = await res.json();
      alert(err.error || 'Błąd aktualizacji');
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Na pewno usunąć salę?')) return;
    const res = await fetch(`http://localhost:3001/api/rooms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Sala usunięta');
      fetchRooms();
    } else {
      const err = await res.json();
      alert(err.error || 'Błąd usuwania');
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5">Zarządzanie salami</Typography>

      {/* Formularz dodawania nowej sali */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label="Nr sali"
          name="roomNumber"
          value={newRoom.roomNumber}
          onChange={(e) => setNewRoom((p) => ({ ...p, roomNumber: e.target.value }))}
        />
        <TextField
          label="Rzędy"
          name="rowsCount"
          value={newRoom.rowsCount}
          onChange={(e) => setNewRoom((p) => ({ ...p, rowsCount: e.target.value }))}
        />
        <TextField
          label="Kolumny"
          name="colsCount"
          value={newRoom.colsCount}
          onChange={(e) => setNewRoom((p) => ({ ...p, colsCount: e.target.value }))}
        />
        <TextField
          label="Layout (JSON)"
          name="layout"
          value={newRoom.layout}
          onChange={(e) => setNewRoom((p) => ({ ...p, layout: e.target.value }))}
        />
        <Button variant="contained" onClick={handleCreateRoom}>
          Dodaj salę
        </Button>
      </Box>

      {/* Tabela sal */}
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nr sali</TableCell>
            <TableCell>Rzędy</TableCell>
            <TableCell>Kolumny</TableCell>
            <TableCell>Layout (JSON)</TableCell>
            <TableCell>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.id}</TableCell>
              <TableCell>
                {editingRoomId === room.id ? (
                  <TextField
                    name="roomNumber"
                    value={editingData.roomNumber}
                    onChange={handleEditChange}
                    sx={{ width: '70px' }}
                  />
                ) : (
                  room.roomNumber
                )}
              </TableCell>
              <TableCell>
                {editingRoomId === room.id ? (
                  <TextField
                    name="rowsCount"
                    value={editingData.rowsCount}
                    onChange={handleEditChange}
                    sx={{ width: '70px' }}
                  />
                ) : (
                  room.rowsCount
                )}
              </TableCell>
              <TableCell>
                {editingRoomId === room.id ? (
                  <TextField
                    name="colsCount"
                    value={editingData.colsCount}
                    onChange={handleEditChange}
                    sx={{ width: '70px' }}
                  />
                ) : (
                  room.colsCount
                )}
              </TableCell>
              <TableCell>
                {editingRoomId === room.id ? (
                  <TextField
                    name="layout"
                    value={editingData.layout}
                    onChange={handleEditChange}
                    sx={{ width: '200px' }}
                  />
                ) : (
                  room.layout
                )}
              </TableCell>
              <TableCell>
                {editingRoomId === room.id ? (
                  <Button variant="contained" onClick={() => saveEdit(room.id)}>
                    Zapisz
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => startEditing(room)}
                    >
                      Edytuj
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => deleteRoom(room.id)}>
                      Usuń
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default AdminRoomsPage;
