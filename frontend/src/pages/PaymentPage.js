// frontend/src/pages/PaymentPage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Obrazki płatności (URL)
const payments = [
  { name: 'Visa', url: 'https://upload.wikimedia.org/.../visa.png' },
  { name: 'MasterCard', url: 'https://upload.wikimedia.org/.../mastercard.png' },
  { name: 'PayPal', url: 'https://upload.wikimedia.org/.../paypal.png' },
  { name: 'BLIK', url: 'https://upload.wikimedia.org/.../blik.png' },
];

function PaymentPage() {
  const navigate = useNavigate();

  const handlePaymentClick = (method) => {
    // Symulujemy płatność
    alert(`Płatność metodą: ${method} zakończona sukcesem!`);
    // Tutaj wywołaj endpoint w backendzie, który np. wysyła mail (NodeMailer)
    fetch('http://localhost:3001/api/payment/confirm', {
      method: 'POST'
      // body: JSON.stringify({ ...dane transakcji... })
    }).then(() => {
      navigate('/'); // powrót do strony głównej
    });
  };

  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Wybierz metodę płatności
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mt: 4 }}>
        {payments.map((p) => (
          <Box
            key={p.name}
            sx={{ width: 150, cursor: 'pointer' }}
            onClick={() => handlePaymentClick(p.name)}
          >
            <img src={p.url} alt={p.name} style={{ width: '100%' }} />
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {p.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default PaymentPage;
