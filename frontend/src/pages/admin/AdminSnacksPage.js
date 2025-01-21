// frontend/src/pages/admin/AdminSnacksPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Box,
  Paper,
} from '@mui/material';

function AdminSnacksPage() {
  const token = localStorage.getItem('token');
  const [snacks, setSnacks] = useState([]);
  const [newSnack, setNewSnack] = useState({ name: '', price: '', quantity: '' });
  const [editSnackId, setEditSnackId] = useState(null);
  const [editSnackData, setEditSnackData] = useState({ name: '', price: '', quantity: '' });

  useEffect(() => {
    fetchSnacks();
  }, []);

  const fetchSnacks = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/snacks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSnacks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateSnack = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/snacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newSnack.name,
          price: parseFloat(newSnack.price),
          quantity: parseInt(newSnack.quantity) || 0,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Błąd tworzenia snacka');
      }
      setNewSnack({ name: '', price: '', quantity: '' });
      fetchSnacks();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteSnack = async (id) => {
    if (!window.confirm('Czy na pewno usunąć snack?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/snacks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Błąd usuwania snacka');
      }
      fetchSnacks();
    } catch (error) {
      alert(error.message);
    }
  };

  const startEditSnack = (snack) => {
    setEditSnackId(snack.id);
    setEditSnackData({
      name: snack.name,
      price: snack.price,
      quantity: snack.quantity,
    });
  };

  const handleEditSnackSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/snacks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editSnackData.name,
          price: parseFloat(editSnackData.price),
          quantity: parseInt(editSnackData.quantity) || 0,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Błąd aktualizacji snacka');
      }
      setEditSnackId(null);
      fetchSnacks();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Zarządzanie Snackami (Admin)
      </Typography>

      {/* Formularz dodawania nowego snacka */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Dodaj nowy snack</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Nazwa"
            value={newSnack.name}
            onChange={(e) => setNewSnack((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Cena"
            type="number"
            value={newSnack.price}
            onChange={(e) => setNewSnack((prev) => ({ ...prev, price: e.target.value }))}
          />
          <TextField
            label="Ilość"
            type="number"
            value={newSnack.quantity}
            onChange={(e) => setNewSnack((prev) => ({ ...prev, quantity: e.target.value }))}
          />
          <Button variant="contained" onClick={handleCreateSnack}>
            Dodaj
          </Button>
        </Box>
      </Paper>

      {/* Tabela snacków */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nazwa</TableCell>
            <TableCell>Cena</TableCell>
            <TableCell>Ilość</TableCell>
            <TableCell>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {snacks.map((snack) => (
            <TableRow key={snack.id}>
              <TableCell>
                {editSnackId === snack.id ? (
                  <TextField
                    value={editSnackData.name}
                    onChange={(e) =>
                      setEditSnackData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  snack.name
                )}
              </TableCell>
              <TableCell>
                {editSnackId === snack.id ? (
                  <TextField
                    type="number"
                    value={editSnackData.price}
                    onChange={(e) =>
                      setEditSnackData((prev) => ({ ...prev, price: e.target.value }))
                    }
                  />
                ) : (
                  `${snack.price.toFixed(2)} zł`
                )}
              </TableCell>
              <TableCell>
                {editSnackId === snack.id ? (
                  <TextField
                    type="number"
                    value={editSnackData.quantity}
                    onChange={(e) =>
                      setEditSnackData((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                  />
                ) : (
                  snack.quantity
                )}
              </TableCell>
              <TableCell>
                {editSnackId === snack.id ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleEditSnackSubmit(snack.id)}
                  >
                    Zapisz
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => startEditSnack(snack)}
                    >
                      Edytuj
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteSnack(snack.id)}
                    >
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

export default AdminSnacksPage;
