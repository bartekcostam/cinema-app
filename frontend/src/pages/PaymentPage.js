// frontend/src/pages/PaymentPage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const payments = [
  { name: 'Visa', url: 'https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782/sxwg9izgrlykensd6gk8' },
  { name: 'MasterCard', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT15DDgS6pLfKadL8Brpq1eI60dmTYqicR7Ag&s' },
  { name: 'PayPal', url: 'https://sky-shop.pl/wp-content/uploads/2022/04/paypal_integracja_skyshop.png' },
  { name: 'BLIK', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Blik_logo.jpg' },
];

function PaymentPage() {
  const navigate = useNavigate();

  const handlePaymentClick = async (method) => {
    alert(`Płatność metodą: ${method} zakończona sukcesem!`);

    // Po udanej płatności - usuwamy localStorage z danymi koszyka
    localStorage.removeItem('ticketPurchase');

    const token = localStorage.getItem('token');
    console.log('PaymentPage.js - token:', token);

    // Endpoint do potwierdzenia płatności i ewentualnej wysyłki maila
    try {
      const res = await fetch('http://localhost:3001/api/payment/confirm', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      console.log('PaymentPage.js - Response /api/payment/confirm status:', res.status);

      // tu można ewentualnie obsłużyć jakiś response.json()
      // const data = await res.json();
      // console.log('PaymentPage.js - confirm data:', data);
    } catch (err) {
      console.error('PaymentPage.js - błąd wywołania /api/payment/confirm:', err);
    }

    // Na koniec przekierowanie np. do strony głównej
    navigate('/');
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
