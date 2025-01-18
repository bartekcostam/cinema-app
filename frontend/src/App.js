// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RepertuarPage from './pages/RepertuarPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import FilmDetailsPage from './pages/FilmDetailsPage';
import TicketPurchasePage from './pages/TicketPurchasePage';
import PaymentPage from './pages/PaymentPage';


// Widoki Użytkownika
import UserDashboardPage from './pages/user/UserDashboardPage';
import UserProfilePage from './pages/user/UserProfilePage';
import UserReservationsPage from './pages/user/UserReservationsPage';

// Widoki Admina
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminFilmsPage from './pages/admin/AdminFilmsPage';
import AdminSeancesPage from './pages/admin/AdminSeancesPage';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminSnacksPage from './pages/admin/AdminSnacksPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Komponenty do ochrony tras
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Publiczne */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/repertuar" element={<RepertuarPage />} />
        <Route path="/select-seance/:seanceId" element={<SeatSelectionPage />} />
        <Route path="/film/:filmId" element={<FilmDetailsPage />} />
        <Route path="/ticket-purchase/:filmId" element={<TicketPurchasePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        {/* Użytkownik (zalogowany) */}
        <Route 
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/user/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/user/reservations"
          element={
            <ProtectedRoute>
              <UserReservationsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin (zalogowany + role=admin) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/films"
          element={
            <AdminRoute>
              <AdminFilmsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/seances"
          element={
            <AdminRoute>
              <AdminSeancesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <AdminRoute>
              <AdminRoomsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/snacks"
          element={
            <AdminRoute>
              <AdminSnacksPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />

        {/* Możesz dodać 404 not found */}
      </Routes>
    </Router>
  );
}

export default App;
