// frontend/src/pages/RegisterPage.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Rejestracja udana!');
        // ewentualnie przekierowanie do strony logowania:
        // window.location.href = '/login';
      } else {
        alert(data.error || 'Błąd rejestracji');
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 3, mt: 5 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Zarejestruj się
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Imię"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nazwisko"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Hasło"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Zarejestruj
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
