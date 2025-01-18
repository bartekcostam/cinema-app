// frontend/src/pages/user/UserReservationsPage.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

function UserReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // fetch GET /api/tickets?userId=...
    // setReservations(response)
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Moje rezerwacje
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Seans</TableCell>
            <TableCell>Miejsca</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Godzina</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((res) => (
            <TableRow key={res.id}>
              <TableCell>{res.filmTitle}</TableCell>
              <TableCell>{res.seatNumbers?.join(', ')}</TableCell>
              <TableCell>{res.date}</TableCell>
              <TableCell>{res.startTime}</TableCell>
              <TableCell>{res.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default UserReservationsPage;
