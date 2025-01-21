import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RepertuarPage from './pages/RepertuarPage';
import SeatSelectionPage from './pages/SeatSelectionPage'; // opcjonalnie
import FilmDetailsPage from './pages/FilmDetailsPage';
import TicketPurchasePage from './pages/TicketPurchasePage';
import PaymentPage from './pages/PaymentPage';

// User
import UserDashboardPage from './pages/user/UserDashboardPage';
import UserProfilePage from './pages/user/UserProfilePage';
import UserReservationsPage from './pages/user/UserReservationsPage';

// Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminFilmsPage from './pages/admin/AdminFilmsPage';
import AdminSeancesPage from './pages/admin/AdminSeancesPage';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminSnacksPage from './pages/admin/AdminSnacksPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Ochrona tras
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Dodajemy nowy import:
import SelectSeancePage from './pages/SelectSeancePage';

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
        
        {/* Szczegóły filmu i ścieżka do kupna */}
        <Route path="/film/:filmId" element={<FilmDetailsPage />} />
        <Route path="/select-seance/:filmId" element={<SelectSeancePage />} />
        <Route path="/ticket-purchase/:seanceId" element={<TicketPurchasePage />} />
        
        {/* Opcjonalna strona wyboru miejsc (jeśli chcesz zostawić) */}
        <Route path="/seat-selection/:seanceId" element={<SeatSelectionPage />} />

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

        {/* 404 not found (opcjonalnie) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
