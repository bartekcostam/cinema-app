// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Przykład: sprawdzamy localStorage
  const token = localStorage.getItem('token');
  // Ewentualnie weryfikacja JWT / fetch do /api/me → to już Twoja logika

  if (!token) {
    // Nie zalogowany
    return <Navigate to="/login" replace />;
  }

  return children; // renderuje child (np. <UserProfilePage/>)
}

export default ProtectedRoute;
