import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button
} from '@mui/material';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Po zalogowaniu wracamy do 'from' (jeśli istniał) lub domyślnego panelu
  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        // Zapisz token i rolę w localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);

        // Jeśli mamy "from", wracamy tam
        if (from) {
          navigate(from, { replace: true });
          return;
        }

        // Jeśli nie mamy "from", przekierowanie zależne od roli:
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        alert(data.error || 'Błąd logowania');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Błąd połączenia');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 3, mt: 5 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Zaloguj się
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
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
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Zaloguj
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
