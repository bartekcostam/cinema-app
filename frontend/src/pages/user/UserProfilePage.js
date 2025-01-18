// frontend/src/pages/user/UserProfilePage.js
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

function UserProfilePage() {
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Pobierz dane usera
    fetch('http://localhost:3001/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setUserData(data);
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    fetch('http://localhost:3001/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          alert(result.error);
        } else {
          alert('Profil zaktualizowany!');
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Mój profil
      </Typography>
      <TextField
        label="Imię"
        name="firstName"
        value={userData.firstName}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Nazwisko"
        name="lastName"
        value={userData.lastName}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        fullWidth
        disabled
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
        Zapisz zmiany
      </Button>
    </Container>
  );
}

export default UserProfilePage;
