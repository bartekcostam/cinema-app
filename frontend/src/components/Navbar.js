// frontend/src/components/Navbar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Cinema App
        </Typography>
        
        <Button color="inherit" component={RouterLink} to="/">
          Strona główna
        </Button>
        <Button color="inherit" component={RouterLink} to="/login">
          Zaloguj
        </Button>
        <Button color="inherit" component={RouterLink} to="/register">
          Zarejestruj
        </Button>
        <Button color="inherit" component={RouterLink} to="/repertuar">
            Repertuar
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
