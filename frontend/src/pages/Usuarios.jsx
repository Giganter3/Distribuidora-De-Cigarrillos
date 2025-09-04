import React, { useState, useEffect } from 'react';
import API from '../api';

const Usuarios = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/users/').then(({data}) => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Página de Usuarios</h2>
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre completo</th>
            <th>Direccion e-mail</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;