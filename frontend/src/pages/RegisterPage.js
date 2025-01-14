// frontend/src/pages/RegisterPage.js
import React, { useState } from 'react';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // ewentualnie przekierowanie do strony logowania
      } else {
        alert(data.error || 'Błąd');
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div>
      <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Imię:</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div>
          <label>Nazwisko:</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Hasło:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
}

export default RegisterPage;
