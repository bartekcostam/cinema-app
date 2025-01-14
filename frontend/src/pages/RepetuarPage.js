// frontend/src/pages/RepertuarPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

function RepertuarPage() {
  const [seances, setSeances] = useState([]);

  useEffect(() => {
    // Po załadowaniu komponentu pobieramy seanse
    fetch('http://localhost:3001/api/seances')
      .then((res) => res.json())
      .then((data) => {
        setSeances(data);
      })
      .catch((err) => {
        console.error('Error fetching seances:', err);
      });
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Repertuar
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Godzina</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Tytuł filmu</TableCell>
              <TableCell>Gatunek</TableCell>
              <TableCell>VIP</TableCell>
              <TableCell>Normalny</TableCell>
              <TableCell>Ulgowy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seances.map((item) => (
              <TableRow key={item.seanceId}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.startTime}</TableCell>
                <TableCell>{item.roomNumber}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.genre}</TableCell>
                <TableCell>{item.vipPrice} zł</TableCell>
                <TableCell>{item.normalPrice} zł</TableCell>
                <TableCell>{item.discountedPrice} zł</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default RepertuarPage;
