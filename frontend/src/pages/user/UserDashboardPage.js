// frontend/src/pages/user/UserDashboardPage.js
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function UserDashboardPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Witaj w panelu użytkownika
      </Typography>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" component={RouterLink} to="/user/profile" sx={{ mr: 2 }}>
          Mój profil
        </Button>
        <Button variant="contained" component={RouterLink} to="/user/reservations">
          Moje rezerwacje
        </Button>
      </Box>
      <Typography variant="body1">
        Tutaj możesz przejrzeć swoje bilety, zarządzać danymi itd.
      </Typography>
    </Container>
  );
}

export default UserDashboardPage;
