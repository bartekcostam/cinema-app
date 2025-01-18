// frontend/src/components/AdminRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Przykład: pobieramy z localStorage user.role lub weryfikujemy token
function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Możesz tu wykonać np. fetch /api/auth/me, sprawdzić role
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      setChecked(true);
      return;
    }
    // Przykładowo – zdeszyfruj role z tokena lub fetch do backendu
    // Poniżej jest uproszczenie
    const userRole = localStorage.getItem('role'); // np. zapisywane w momencie logowania
    if (userRole === 'admin') {
      setIsAdmin(true);
    }
    setChecked(true);
  }, []);

  if (!checked) {
    // Ładowanie / sprawdzanie
    return <div>Sprawdzanie uprawnień...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
