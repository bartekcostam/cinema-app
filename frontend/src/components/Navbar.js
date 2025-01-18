// frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (token) {
      setLoggedIn(true);
      setRole(userRole);
    } else {
      setLoggedIn(false);
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setLoggedIn(false);
    setRole(null);
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Cinema App
        </Typography>

        <Button color="inherit" component={RouterLink} to="/">
          Strona główna
        </Button>
        <Button color="inherit" component={RouterLink} to="/repertuar">
          Repertuar
        </Button>

        {!loggedIn && (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Zaloguj
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Rejestracja
            </Button>
          </>
        )}

        {loggedIn && role !== 'admin' && (
          <>
            <Button color="inherit" component={RouterLink} to="/user/dashboard">
              Mój panel
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Wyloguj
            </Button>
          </>
        )}

        {loggedIn && role === 'admin' && (
          <>
            <Button color="inherit" component={RouterLink} to="/admin/dashboard">
              Admin panel
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
