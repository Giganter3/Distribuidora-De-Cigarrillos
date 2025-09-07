import { useEffect, useState } from 'react'
import API from '../api'

export default function Asientos() {
  const [accounts, setAccounts] = useState([])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [description, setDescription] = useState('')
  const [lines, setLines] = useState([{account:'', debit:0, credit:0, accountType: null}])
  const [message, setMessage] = useState('')
  const [journalEntries, setJournalEntries] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    API.get('/accounts').then(({data}) => setAccounts(data))
    API.get('/journal-entries/').then(({data}) => setJournalEntries(data));
  }, [refreshTrigger])

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

  async function submit(e) {
    e.preventDefault()

    const totalDebit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);

    if (totalDebit === 0 && totalCredit === 0) {
      setMessage('Error: No se puede registrar un asiento con valores en 0.');
      return;
    }

    if (totalDebit !== totalCredit) {
      setMessage('Error: El total del Debe no coincide con el total del Haber.');
      return;
    }

    const payload = { date, description, lines: lines.map(l => ({account: l.account || null, debit: l.debit || 0, credit: l.credit || 0})) }

    try {
      await API.post('/journal-entries/', payload);
      setMessage('Asiento registrado con éxito!');
      setDescription(''); 
      setLines([{account:'', debit:0, credit:0, accountType: null}])
      setDate(() => new Date().toISOString().slice(0,10))
      setRefreshTrigger(prev => prev + 1); // Refresh the list
    } catch (err) {
      setMessage('Error: verificá que Debe = Haber y que cada línea tenga un solo lado.')
    }
  }

  return (
    <div>
      <h2>Registrar Asiento</h2>
      <form onSubmit={submit}>
        <label style={{ marginBottom: '15px' }}>Fecha: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Debe: <input type="number" value={line.debit} onChange={e => updateLine(index, 'debit', e.target.value)} /></label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Haber: <input type="number" value={line.credit} onChange={e => updateLine(index, 'credit', e.target.value)} /></label>
            <button type="button" onClick={addLine}>+</button>
            {lines.length > 1 && (
              <button type="button" onClick={() => removeLine(index)}>-</button>
            )}
          </div>
        ))}
        </div>
        <button type="submit">Guardar</button>
      </form>
      {message && <p>{message}</p>}

      <h3>Asientos Registrados</h3>
      <button onClick={() => setRefreshTrigger(prev => prev + 1)} style={{ marginTop: '10px' }}>Actualizar Asientos</button>
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Cuenta</th>
            <th>Debe</th>
            <th>Haber</th>
          </tr>
        </thead>
        <tbody>
          {journalEntries.map(entry => (
            entry.lines.map((line, index) => (
              <tr key={`${entry.id}-${index}`} className="journal-entry-row">
                {index === 0 ? (
                  <td rowSpan={entry.lines.length}>{entry.date}</td>
                ) : null}
                {index === 0 ? (
                  <td rowSpan={entry.lines.length}>{entry.description}</td>
                ) : null}
                <td>{accounts.find(acc => acc.id === line.account)?.name}</td>
                <td style={{ textAlign: 'right' }}>{parseFloat(line.debit ?? 0).toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{parseFloat(line.credit ?? 0).toFixed(2)}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  )
}
