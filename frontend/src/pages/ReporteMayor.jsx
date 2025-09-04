import { useEffect, useState } from 'react'
import API from '../api'

export default function ReporteMayor() {
  const [accounts, setAccounts] = useState([])
  const [cuenta, setCuenta] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    API.get('/accounts').then(({data}) => setAccounts(data))
  }, [])

  async function buscar() {
    if (!cuenta) return
    const params = { cuenta_id: cuenta }
    if (desde) params.desde = desde
    if (hasta) params.hasta = hasta
    const { data } = await API.get('/reports/mayor', { params })
    setRows(data)
  }

  const saldoFinal = rows.length ? rows[rows.length - 1].saldo : 0

  return (
    <div>
      <h2>Libro Mayor</h2>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <select value={cuenta} onChange={e=>setCuenta(e.target.value)}>
          <option value="">Cuenta…</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
        </select>
        <input type="date" value={desde} onChange={e=>setDesde(e.target.value)} />
        <input type="date" value={hasta} onChange={e=>setHasta(e.target.value)} />
        <button onClick={buscar}>Buscar</button>
      </div>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th><th>Fecha</th><th>Descripción</th><th>Debe</th><th>Haber</th><th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.entry_id}</td>
              <td>{r.fecha}</td>
              <td>{r.descripcion}</td>
              <td style={{textAlign:'right'}}>{r.debe?.toFixed?.(2) ?? r.debe}</td>
              <td style={{textAlign:'right'}}>{r.haber?.toFixed?.(2) ?? r.haber}</td>
              <td style={{textAlign:'right'}}>{r.saldo?.toFixed?.(2) ?? r.saldo}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5"><strong>Saldo final</strong></td>
            <td style={{textAlign:'right'}}><strong>{Number(saldoFinal).toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}