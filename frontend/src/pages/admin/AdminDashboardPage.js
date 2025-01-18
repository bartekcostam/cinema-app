// frontend/src/pages/admin/AdminDashboardPage.js
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function AdminDashboardPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel Administratora
      </Typography>
      <Box sx={{ my: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" component={RouterLink} to="/admin/films">
          Zarządzaj filmami
        </Button>
        <Button variant="contained" component={RouterLink} to="/admin/seances">
          Zarządzaj seansami
        </Button>
        <Button variant="contained" component={RouterLink} to="/admin/rooms">
          Zarządzaj salami
        </Button>
        <Button variant="contained" component={RouterLink} to="/admin/snacks">
          Zarządzaj snackami
        </Button>
        <Button variant="contained" component={RouterLink} to="/admin/users">
          Zarządzaj użytkownikami
        </Button>
      </Box>

      <Typography variant="body1">
        Tutaj możesz przeglądać statystyki, raporty, itp.
      </Typography>
    </Container>
  );
}

export default AdminDashboardPage;
