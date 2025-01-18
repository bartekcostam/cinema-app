// backend/controllers/paymentController.js
import nodemailer from 'nodemailer';

export const confirmPayment = async (req, res) => {
  try {
    // Tutaj pobieramy dane zamówienia z bazy, lub z req.body
    // np. userId = req.user.id
    // ...
    const userEmail = 'user@example.com'; // pobrane z bazy

    // Konfiguracja mailera
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'twojemail@gmail.com',
        pass: 'hasloApp'
      }
    });

    const mailOptions = {
      from: 'twojemail@gmail.com',
      to: userEmail,
      subject: 'Potwierdzenie zakupu biletu',
      text: `Dziękujemy za zakup biletu! Szczegóły: ...`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Płatność potwierdzona, mail wysłany.' });
  } catch (error) {
    console.error('confirmPayment error:', error);
    res.status(500).json({ error: 'Błąd serwera przy wysyłce maila.' });
  }
};
