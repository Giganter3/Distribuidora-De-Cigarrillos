import { useState } from 'react'
import axios from 'axios'

export function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      const { data } = await axios.post('http://localhost:8000/api/token/', { username, password })
      localStorage.setItem('token', data.access)
      window.location.href = '/app'
    } catch (err) {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'100vh', fontFamily:'system-ui'}}>
      <form onSubmit={submit} style={{display:'grid', gap:8, width:300}}>
        <h2>Iniciar sesión</h2>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Usuario" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" />
        <button>Entrar</button>
        {error && <small style={{color:'red'}}>{error}</small>}
      </form>
    </div>
  )
}