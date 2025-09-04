import React, { useState, useEffect } from 'react';
import API from '../api';

const PlanDeCuentas = () => {
  const [accounts, setAccounts] = useState([]);
  const [showNewConceptForm, setShowNewConceptForm] = useState(false);
  const [newConceptName, setNewConceptName] = useState('');
  const [newConceptType, setNewConceptType] = useState('');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState([{ account: '', debit: 0, credit: 0, date: new Date().toISOString().slice(0,10), accountType: null }]);

  useEffect(() => {
    API.get('/accounts').then(({data}) => setAccounts(data));
  }, []);

  function updateLine(index, field, value) {
    const newLines = [...lines];
    if (field === 'account') {
      const selectedAcc = accounts.find(acc => acc.id === Number(value));
      newLines[index].account = value;
      newLines[index].accountType = selectedAcc ? selectedAcc.type : null;
    } else {
      newLines[index][field] = value;
    }
    setLines(newLines);
  }

  function addLine() {
    setLines([...lines, { account: '', debit: 0, credit: 0, date: new Date().toISOString().slice(0,10), accountType: null }]);
  }

  function removeLine(index) {
    setLines(lines.filter((_, i) => i !== index));
  }

  async function handleNewConceptSubmit(e) {
    e.preventDefault();
    try {
      await API.post('/accounts/', { name: newConceptName, type: newConceptType });
      alert('Concepto creado con éxito!');
      setNewConceptName('');
      setNewConceptType('');
      setShowNewConceptForm(false);
      // Refresh accounts list
      API.get('/accounts').then(({data}) => setAccounts(data));
    } catch (error) {
      console.error('Error al crear concepto:', error);
      alert('Error al crear concepto. Por favor, verifica los datos.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await API.post('/journal-entries/', { date: lines[0].date, description, lines }); // Assuming backend expects { lines: [...] }
      alert('Movimiento(s) registrado(s) con éxito!');
      setLines([{ account: '', debit: 0, credit: 0, date: new Date().toISOString().slice(0,10), accountType: null }]); // Reset fields
    } catch (error) {
      console.error('Error al registrar movimiento(s):', error);
      alert('Error al registrar movimiento(s). Por favor, verifica los datos.');
    }
  }

  return (
    <div>
      <h2>Registrar Movimiento en Plan de Cuentas <button type="button" onClick={() => setShowNewConceptForm(!showNewConceptForm)} style={{ fontSize: '0.8em', padding: '0.2em 0.5em' }}>{showNewConceptForm ? '-' : '+'}</button></h2>
      {showNewConceptForm && (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
          <h3>Crear Nuevo Concepto</h3>
          <form onSubmit={handleNewConceptSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
            <button type="submit">Crear</button>
            <button type="button" onClick={() => setShowNewConceptForm(false)}>Cancelar</button>
          </form>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label style={{ marginBottom: '15px' }}>Fecha: <input type="date" value={lines[0].date} onChange={e => updateLine(0, 'date', e.target.value)} /></label>
        <label style={{ marginBottom: '15px' }}>Descripción: <input type="text" value={description} onChange={e => setDescription(e.target.value)} /></label>
        <div style={{ marginTop: '15px' }}>
        {lines.map((line, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Concepto:
              <select value={line.account} onChange={e => {
                updateLine(index, 'account', e.target.value);
              }}>
                <option value="">Seleccionar Concepto...</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Debe: <input type="number" value={line.debit} onChange={e => updateLine(index, 'debit', e.target.value)} disabled={line.accountType === 'LI'} style={{ backgroundColor: !line.accountType ? '#ffffff' : (line.accountType === 'LI' ? '#ffdddd' : '#ddffdd') }} /></label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Haber: <input type="number" value={line.credit} onChange={e => updateLine(index, 'credit', e.target.value)} disabled={line.accountType === 'AS' || line.accountType === 'EX'} style={{ backgroundColor: !line.accountType ? '#ffffff' : (line.accountType === 'AS' || line.accountType === 'EX' ? '#ffdddd' : '#ddffdd') }} /></label>
            <button type="button" onClick={addLine}>+</button>
            {lines.length > 1 && (
              <button type="button" onClick={() => removeLine(index)}>-</button>
            )}
          </div>
        ))}
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default PlanDeCuentas;