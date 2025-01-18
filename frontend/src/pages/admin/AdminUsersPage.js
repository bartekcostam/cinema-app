// frontend/src/pages/admin/AdminUsersPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  MenuItem
} from '@mui/material';

function AdminUsersPage() {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3001/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const changeRole = async (userId, newRole) => {
    const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
      alert('Zmieniono rolę');
      fetchUsers();
    } else {
      alert('Błąd zmiany roli');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Usunąć użytkownika?')) return;
    const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Usunięto użytkownika');
      fetchUsers();
    } else {
      alert('Błąd usuwania użytkownika');
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5">Zarządzanie użytkownikami</Typography>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Imię</TableCell>
            <TableCell>Nazwisko</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rola</TableCell>
            <TableCell>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.firstName}</TableCell>
              <TableCell>{u.lastName}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  sx={{ width: 100 }}
                >
                  <MenuItem value="user">user</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Button color="error" variant="outlined" onClick={() => deleteUser(u.id)}>
                  Usuń
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default AdminUsersPage;
