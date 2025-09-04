import { useEffect, useState } from 'react'
import API from '../api'

export default function ReporteDiario() {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [rows, setRows] = useState([])

  async function buscar() {
    const params = {}
    if (desde) params.desde = desde
    if (hasta) params.hasta = hasta
    const { data } = await API.get('/reports/diario', { params })
    setRows(data)
  }

  useEffect(() => { buscar() }, [])

  const totalDebe = rows.reduce((a,r)=>a + (r.debe||0), 0)
  const totalHaber = rows.reduce((a,r)=>a + (r.haber||0), 0)

  return (
    <div>
      <h2>Libro Diario</h2>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <input type="date" value={desde} onChange={e=>setDesde(e.target.value)} />
        <input type="date" value={hasta} onChange={e=>setHasta(e.target.value)} />
        <button onClick={buscar}>Buscar</button>
      </div>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th><th>Fecha</th><th>Descripción</th><th>Cuenta</th><th>Debe</th><th>Haber</th><th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.entry_id}</td>
              <td>{r.fecha}</td>
              <td>{r.descripcion}</td>
              <td>{r.cuenta}</td>
              <td style={{textAlign:'right'}}>{r.debe?.toFixed?.(2) ?? r.debe}</td>
              <td style={{textAlign:'right'}}>{r.haber?.toFixed?.(2) ?? r.haber}</td>
              <td>{r.usuario}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4"><strong>Totales</strong></td>
            <td style={{textAlign:'right'}}><strong>{totalDebe.toFixed(2)}</strong></td>
            <td style={{textAlign:'right'}}><strong>{totalHaber.toFixed(2)}</strong></td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}