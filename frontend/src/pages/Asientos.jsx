import { useEffect, useState } from 'react'
import API from '../api'

export default function Asientos() {
  const [accounts, setAccounts] = useState([])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [description, setDescription] = useState('')
  const [lines, setLines] = useState([{account:'', debit:0, credit:0}])
  const [message, setMessage] = useState('')
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    API.get('/accounts').then(({data}) => setAccounts(data))
    API.get('/journal-entries/').then(({data}) => setJournalEntries(data));
  }, [refreshTrigger])

  function updateLine(i, field, value) {
    const copy = [...lines]
    copy[i][field] = field === 'account' ? Number(value) : Number(value)
    setLines(copy)
  }
  function addLine(i) {
    const copy = [...lines]
    copy.splice(i + 1, 0, {account:'', debit:0, credit:0})
    setLines(copy)
  }
  function removeLine(i) { setLines(lines.filter((_,idx) => idx !== i)) }

  function handleEdit(entry) {
    setEditingEntryId(entry.id);
    setDate(entry.date);
    setDescription(entry.description);
    setLines(entry.lines.map(line => ({
      account: line.account,
      debit: parseFloat(line.debit),
      credit: parseFloat(line.credit),
      accountType: accounts.find(acc => acc.id === line.account)?.type // Get account type
    })));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (window.confirm('¿Estás seguro de que quieres eliminar este asiento?')) {
      try {
        await API.delete(`/journal-entries/${id}/`);
        setMessage('Asiento eliminado con éxito!');
        setRefreshTrigger(prev => prev + 1); // Refresh the list
      } catch (error) {
        console.error('Error al eliminar asiento:', error);
        setMessage('Error al eliminar asiento.');
      }
    }
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
      if (editingEntryId) {
        // Update existing entry
        await API.put(`/journal-entries/${editingEntryId}/`, payload);
        setMessage('Asiento actualizado con éxito!');
      } else {
        // Create new entry
        await API.post('/journal-entries/', payload);
        setMessage('Asiento registrado con éxito!');
      }
      setDescription(''); 
      setLines([{account:'', debit:0, credit:0}])
      setDate(() => new Date().toISOString().slice(0,10))
      setEditingEntryId(null); // Clear editing state
      setRefreshTrigger(prev => prev + 1); // Refresh the list
    } catch (err) {
      setMessage('Error: verificá que Debe = Haber y que cada línea tenga un solo lado.')
    }
  }

  return (
    <div>
      <h2>Registrar Asiento</h2>
      <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:800}}>
        <label>Fecha <input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
        <label>Descripción <input value={description} onChange={e=>setDescription(e.target.value)} /></label>
      </form>
      <button onClick={() => setRefreshTrigger(prev => prev + 1)} style={{ marginTop: '10px' }}>Actualizar Asientos</button>

      <h3>Asientos Registrados</h3>
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Cuenta</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Acciones</th>
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
                {index === 0 ? (
                  <td rowSpan={entry.lines.length}>
                    <button onClick={() => handleEdit(entry)}>Editar</button>
                    <button onClick={() => handleDelete(entry.id)}>Eliminar</button>
                  </td>
                ) : null}
              </tr>
            ))
          ))}
        </tbody>
      </table>

      
      {/* Modification/Deletion interface will go here */}
    </div>
  )
}