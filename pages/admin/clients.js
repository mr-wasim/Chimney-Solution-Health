import { useEffect, useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import AdminLayout from '../../components/AdminLayout'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('cs_admin_token')
        : null
    if (!token) Router.push('/admin/login')
    else fetchClients(token)
  }, [])

  async function fetchClients(token) {
    setLoading(true)
    try {
      const res = await axios.get('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setClients(res.data || [])
    } catch (err) {
      console.error('Error fetching clients:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">All Clients</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : clients.length === 0 ? (
        <p className="text-gray-500 text-center">No clients found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <div
              key={c._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  {c.clientName}
                </h3>
                <span className="text-sm text-gray-500">{c.clientNumber}</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Product:</span> {c.product}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Visits:</span> {c.visits}
              </p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
