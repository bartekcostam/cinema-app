// frontend/src/pages/admin/AdminDashboardPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFilms: 0,
    totalSeances: 0,
    totalTickets: 0,
  });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, [token]);

  // Przyciski do innych sekcji admina
  const goToFilms = () => navigate('/admin/films');
  const goToSeances = () => navigate('/admin/seances');
  const goToRooms = () => navigate('/admin/rooms');
  const goToSnacks = () => navigate('/admin/snacks');
  const goToUsers = () => navigate('/admin/users');

  // Dane do wykresów – np. BarChart
  const barData = [
    { name: 'Użytkownicy', value: stats.totalUsers },
    { name: 'Filmy', value: stats.totalFilms },
    { name: 'Seanse', value: stats.totalSeances },
    { name: 'Rezerwacje', value: stats.totalTickets },
  ];

  // Dane do PieChart (może te same dane)
  const pieData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Films', value: stats.totalFilms },
    { name: 'Seances', value: stats.totalSeances },
    { name: 'Tickets', value: stats.totalTickets },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57']; // kolory dla wykresu kołowego

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel Administratora - Statystyki
      </Typography>

      {/* Pasek przycisków */}
      <Box sx={{ my: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={goToFilms}>
          Zarządzaj filmami
        </Button>
        <Button variant="contained" onClick={goToSeances}>
          Zarządzaj seansami
        </Button>
        <Button variant="contained" onClick={goToRooms}>
          Zarządzaj salami
        </Button>
        <Button variant="contained" onClick={goToSnacks}>
          Zarządzaj snackami
        </Button>
        <Button variant="contained" onClick={goToUsers}>
          Zarządzaj użytkownikami
        </Button>
      </Box>

      {/* Sekcja wykresów */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: 'center', height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Podsumowanie (BarChart)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: 'center', height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Podsumowanie (PieChart)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#82ca9d"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboardPage;
