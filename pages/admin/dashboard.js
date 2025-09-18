// pages/admin/dashboard.js
import { useEffect, useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import AdminLayout from '../../components/AdminLayout'

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('cs_admin_token')
        : null
    if (!token) Router.push('/admin/login')
    else fetchReports(token)
  }, [])

  async function fetchReports(token) {
    setLoading(true)
    try {
      const res = await axios.get('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReports(res.data || [])
    } catch (err) {
      console.error('Error fetching reports:', err)
      if (err.response?.status === 401) {
        localStorage.removeItem('cs_admin_token')
        Router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  async function deleteReport(id) {
    if (!confirm('Delete this report?')) return
    try {
      const token = localStorage.getItem('cs_admin_token')
      await axios.delete(`/api/admin/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReports(reports.filter((r) => r._id !== id))
      alert('Deleted successfully ✅')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete ❌')
    }
  }

  function openEdit(report) {
    setEditing(report._id)
    setForm({
      clientName: report.clientName || '',
      clientNumber: report.clientNumber || '',
      product: report.product || '',
      initialScore: report.initialScore || 100,
      cleaningType: report.cleaningType || 'normal',
      notes: report.notes || '',
    })
  }

  function closeEdit() {
    setEditing(null)
    setForm({})
  }

  async function saveEdit() {
    try {
      const token = localStorage.getItem('cs_admin_token')
      const res = await axios.put(`/api/admin/reports/${editing}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const updated = res.data.report
      setReports(reports.map((r) => (r._id === editing ? updated : r)))
      closeEdit()
      alert('Report updated ✅')
    } catch (err) {
      console.error('Update error:', err)
      alert('Update failed ❌')
    }
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-extrabold mb-8 text-indigo-700">
        All Reports
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500"></div>
        </div>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-center">No reports found.</p>
      ) : (
        <div className="overflow-x-auto bg-gradient-to-br from-white to-indigo-50 shadow-lg rounded-xl border border-indigo-100">
          {/* Desktop Table */}
          <table className="hidden md:table w-full">
            <thead>
              <tr className="bg-indigo-100 text-left text-indigo-700 text-sm">
                <th className="p-4">Client</th>
                <th className="p-4">Product</th>
                <th className="p-4">Score</th>
                <th className="p-4">Visits</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r._id}
                  className="border-b hover:bg-indigo-50 transition duration-200"
                >
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">
                      {r.clientName}
                    </p>
                    <p className="text-xs text-gray-800">{r.clientNumber}</p>
                  </td>
                  <td className="p-4">{r.product}</td>
                  <td className="p-4 font-medium text-indigo-600">
                    {r.initialScore}
                  </td>
                  <td className="p-4">{r.visits || 0}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="px-3 py-1 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteReport(r._id)}
                      className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4">
            {reports.map((r) => (
              <div
                key={r._id}
                className="bg-white border border-indigo-100 rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold text-gray-700">{r.clientName}</h3>
                  <span className="text-xs text-gray-500">
                    {r.clientNumber}
                  </span>
                </div>
                <p className="text-sm text-gray-600!">
                  <span className="font-medium text-indigo-600">Product:</span> {r.product}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Score:</span>{' '}
                  <span className="text-indigo-600 font-bold">
                    {r.initialScore}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Visits:</span> {r.visits || 0}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(r)}
                    className="flex-1 px-3 py-1 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteReport(r._id)}
                    className="flex-1 px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn border border-gray-200">
    <h3 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
      ✨ Edit Report ✨
    </h3>
    <div className="space-y-3">
      <input
        type="text"
        value={form.clientName}
        onChange={(e) =>
          setForm({ ...form, clientName: e.target.value })
        }
        placeholder="Client Name"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 placeholder-black shadow-sm hover:shadow-md transition"
      />
      <input
        type="text"
        value={form.clientNumber}
        onChange={(e) =>
          setForm({ ...form, clientNumber: e.target.value })
        }
        placeholder="Client Number"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 placeholder-black shadow-sm hover:shadow-md transition"
      />
      <input
        type="text"
        value={form.product}
        onChange={(e) =>
          setForm({ ...form, product: e.target.value })
        }
        placeholder="Product"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 placeholder-black shadow-sm hover:shadow-md transition"
      />
      <input
        type="number"
        value={form.initialScore}
        onChange={(e) =>
          setForm({ ...form, initialScore: Number(e.target.value) })
        }
        placeholder="Initial Score"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 placeholder-black shadow-sm hover:shadow-md transition"
      />
      <select
        value={form.cleaningType}
        onChange={(e) =>
          setForm({ ...form, cleaningType: e.target.value })
        }
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 shadow-sm hover:shadow-md transition"
      >
        <option value="normal">Normal</option>
        <option value="deep">Deep</option>
      </select>
      <textarea
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        placeholder="Notes"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 placeholder-black shadow-sm hover:shadow-md transition"
      />
    </div>
    <div className="flex justify-end gap-3 mt-5">
      <button
        onClick={closeEdit}
        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition shadow-sm"
      >
        Cancel
      </button>
      <button
        onClick={saveEdit}
        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md"
      >
        Update
      </button>
    </div>
  </div>
</div>

      )}
    </AdminLayout>
  )
}
