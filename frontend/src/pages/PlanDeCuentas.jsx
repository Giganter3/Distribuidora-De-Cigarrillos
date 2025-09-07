// Force re-bundle again
import React, { useState, useEffect } from 'react';
import API from '../api';

const PlanDeCuentas = () => {
  const [accounts, setAccounts] = useState([]);
  const [showNewConceptForm, setShowNewConceptForm] = useState(false);
  const [newConceptCode, setNewConceptCode] = useState('');
  const [newConceptName, setNewConceptName] = useState('');
  const [newConceptType, setNewConceptType] = useState('');
  const [newConceptParent, setNewConceptParent] = useState('');
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    API.get('/accounts').then(({ data }) => setAccounts(data));
  };

  const handleNewConceptSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code: newConceptCode,
      name: newConceptName,
      type: newConceptType,
      parent: newConceptParent || null
    };
    try {
      if (editingAccount) {
        await API.put(`/accounts/${editingAccount.id}/`, payload);
        alert('Concepto actualizado con éxito!');
      } else {
        await API.post('/accounts/', payload);
        alert('Concepto creado con éxito!');
      }
      resetForm();
      fetchAccounts();
    } catch (error) {
      console.error('Error al procesar el concepto:', error);
      alert('Error al procesar el concepto. Por favor, verifica los datos.');
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setNewConceptCode(account.code);
    setNewConceptName(account.name);
    setNewConceptType(account.type);
    setNewConceptParent(account.parent || '');
    setShowNewConceptForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este concepto?')) {
      try {
        await API.delete(`/accounts/${accountId}/`);
        alert('Concepto eliminado con éxito!');
        fetchAccounts();
      } catch (error) {
        console.error('Error al eliminar el concepto:', error);
        alert('Error al eliminar el concepto.');
      }
    }
  };

  const resetForm = () => {
    setNewConceptCode('');
    setNewConceptName('');
    setNewConceptType('');
    setNewConceptParent('');
    setEditingAccount(null);
    setShowNewConceptForm(false);
  };

  const accountTypes = {
    AS: 'Activo',
    LI: 'Pasivo',
    EQ: 'Patrimonio',
    RE: 'Ingreso',
    EX: 'Gasto'
  };

  return (
    <div>
      <h2>
        Plan de Cuentas
        <button type="button" onClick={() => { setShowNewConceptForm(!showNewConceptForm); setEditingAccount(null); }} style={{ marginLeft: '10px', fontSize: '0.8em', padding: '0.2em 0.5em' }}>
          {showNewConceptForm && !editingAccount ? 'Cancelar' : 'Crear Nuevo Concepto'}
        </button>
      </h2>

      {showNewConceptForm && (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
          <h3>{editingAccount ? 'Editar Concepto' : 'Crear Nuevo Concepto'}</h3>
          <form onSubmit={handleNewConceptSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <label>Código: <input type="text" value={newConceptCode} onChange={e => setNewConceptCode(e.target.value)} placeholder="(Opcional)" /></label>
            <label>Nombre: <input type="text" value={newConceptName} onChange={e => setNewConceptName(e.target.value)} required /></label>
            <label>Tipo:
              <select value={newConceptType} onChange={e => setNewConceptType(e.target.value)} required>
                <option value="">Seleccionar Tipo...</option>
                <option value="AS">Activo (AS)</option>
                <option value="LI">Pasivo (LI)</option>
                <option value="EQ">Patrimonio (EQ)</option>
                <option value="RE">Ingreso (RE)</option>
                <option value="EX">Gasto (EX)</option>
              </select>
            </label>
            <label>Cuenta Padre:
              <select value={newConceptParent} onChange={e => setNewConceptParent(e.target.value)}>
                <option value="">Ninguna (Cuenta Principal)</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.code} - {account.name}</option>
                ))}
              </select>
            </label>
            <button type="submit">{editingAccount ? 'Actualizar' : 'Crear'}</button>
            {editingAccount && <button type="button" onClick={resetForm}>Cancelar Edición</button>}
          </form>
        </div>
      )}

      <h3>Listado de Cuentas</h3>
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.code}</td>
              <td>{account.name}</td>
              <td>{accountTypes[account.type] || account.type}</td>
              <td>
                <button onClick={() => handleEdit(account)}>Editar</button>
                <button onClick={() => handleDelete(account.id)} style={{ marginLeft: '5px' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanDeCuentas;
