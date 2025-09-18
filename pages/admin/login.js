import { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Header from '../../components/Header'

export default function AdminLogin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [msg, setMsg] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', { user, pass })
      if (res.data?.token) {
        // store token + role
        localStorage.setItem('cs_admin_token', res.data.token)
        localStorage.setItem('cs_role', 'admin')
        Router.push('/admin/dashboard')
      } else {
        setMsg('Invalid credentials')
      }
    } catch (err) {
      setMsg('Login error')
    }
  }

  return (
    <div>
      <Header title="Admin Login" />
      <main className="max-w-md mx-auto p-6">
        <form onSubmit={handleLogin} className="bg-white/5 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            placeholder="username"
            value={user}
            onChange={e => setUser(e.target.value)}
            className="w-full p-3 rounded bg-black/30 mb-3"
          />
          <input
            placeholder="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            type="password"
            className="w-full p-3 rounded bg-black/30 mb-3"
          />
          <button className="px-4 py-2 rounded bg-brand font-semibold">
            Login
          </button>
          {msg && <div className="mt-3 text-sm text-red-400">{msg}</div>}
        </form>
      </main>
    </div>
  )
}
