// frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Navbar() {
  const navigate = useNavigate();

  // Od razu wczytujemy z localStorage, aby uniknąć migania
  const initialToken = localStorage.getItem('token');
  const initialRole = localStorage.getItem('role');

  const [loggedIn, setLoggedIn] = useState(!!initialToken);
  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    // Gdyby token/role zmieniły się dynamicznie
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setLoggedIn(!!token);
    setRole(userRole);
  }, []);

  const handleLogoClick = () => {
    if (!loggedIn) {
      navigate('/');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/'); // lub /user/dashboard
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setLoggedIn(false);
    setRole(null);
    navigate('/login');
  };

  // Przycisk "Cofnij"
  const handleBack = () => {
    navigate(-1); // cofamy się w historii
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Ikona "cofnij" */}
        <IconButton color="inherit" onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        {/* Logo Cinema App */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={handleLogoClick}
        >
          Cinema App
        </Typography>

        {/* Jeśli niezalogowany */}
        {!loggedIn && (
          <>
            <Button color="inherit" component={RouterLink} to="/">
              Strona główna
            </Button>
            <Button color="inherit" component={RouterLink} to="/login">
              Zaloguj
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Rejestracja
            </Button>
          </>
        )}

        {/* Jeśli zalogowany user */}
        {loggedIn && role === 'user' && (
          <>
            <Button color="inherit" component={RouterLink} to="/">
              Strona główna
            </Button>
            <Button color="inherit" component={RouterLink} to="/repertuar">
              Repertuar
            </Button>
            <Button color="inherit" component={RouterLink} to="/user/dashboard">
              Mój panel
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Wyloguj
            </Button>
          </>
        )}

        {/* Jeśli zalogowany admin */}
        {loggedIn && role === 'admin' && (
          <>
            <Button color="inherit" component={RouterLink} to="/admin/dashboard">
              Admin Panel
            </Button>
            <Button color="inherit" component={RouterLink} to="/repertuar">
              Repertuar
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Wyloguj
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
