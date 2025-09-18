import { useEffect, useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import AdminLayout from '../../components/AdminLayout'

export default function Renewals() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('cs_admin_token')
        : null
    if (!token) Router.push('/admin/login')
    else fetchRenewals(token)
  }, [])

  async function fetchRenewals(token) {
    setLoading(true)
    try {
      const res = await axios.get('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      })

      // ✅ Filter: only clients with 6/8 months completed
      const now = new Date()
      const filtered = (res.data || []).filter((c) => {
        if (!c.createdAt) return false
        const created = new Date(c.createdAt)
        const months = (now - created) / (1000 * 60 * 60 * 24 * 30) // diff in months
        return Math.round(months) === 6 || Math.round(months) === 8
      })

      setClients(filtered)
    } catch (err) {
      console.error('Error fetching renewals:', err)
    } finally {
      setLoading(false)
    }
  }

  async function renewClient(id) {
    try {
      await axios.post(`/api/admin/reports/renew`, { id })
      fetchRenewals(localStorage.getItem('cs_admin_token'))
    } catch (err) {
      console.error('Renew error:', err)
    }
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        6/8 Month Renewal Clients
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : clients.length === 0 ? (
        <p className="text-gray-500 text-center">No clients due for renewal.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <div
              key={c._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {c.clientName}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{c.clientNumber}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Product:</span> {c.product}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Score:</span> {c.initialScore}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Joined: {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => renewClient(c._id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Renew
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
