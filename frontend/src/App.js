// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
// import HomePage, RepertuarPage, itp.

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Strona główna</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* inne ścieżki */}
      </Routes>
    </Router>
  );
}

export default App;
