import { useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import Router from 'next/router'

export default function Technician() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    clientName: '',
    clientNumber: '',
    address: '',
    product: 'chimney',
    cleaningType: 'normal',
    metrics: {} // dynamic
  })
  const [message, setMessage] = useState(null)

  function handleMetricChange(key, value) {
    setForm(s => ({...s, metrics: {...s.metrics, [key]: value}}))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/reports/create', form)
      const { id, qrDataUrl } = res.data
      setMessage('Report created — opening QR preview...')
      // Redirect to report page
      Router.push(`/report/${id}`)
    } catch (err) {
      console.error(err)
      setMessage('Error creating report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header title="Technician — Create Report" />
      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Technician Form</h2>

          <label className="block mb-2 text-sm">Client name</label>
          <input required value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} className="w-full p-3 rounded bg-black/30 mb-3"/>

          <label className="block mb-2 text-sm">Client number</label>
          <input required value={form.clientNumber} onChange={e => setForm({...form, clientNumber: e.target.value})} className="w-full p-3 rounded bg-black/30 mb-3"/>

          <label className="block mb-2 text-sm">Address</label>
          <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full p-3 rounded bg-black/30 mb-3"/>

          <label className="block mb-2 text-sm">Product</label>
          <select value={form.product} onChange={e => setForm({...form, product: e.target.value})} className="w-full p-3 rounded bg-black/30 mb-4">
            <option value="chimney">Chimney</option>
            <option value="hob">Hob</option>
          </select>

          <label className="block mb-2 text-sm">Cleaning type</label>
          <select value={form.cleaningType} onChange={e => setForm({...form, cleaningType: e.target.value})} className="w-full p-3 rounded bg-black/30 mb-4">
            <option value="normal">Normal cleaning (6 months decay)</option>
            <option value="deep">Deep cleaning (8 months decay)</option>
          </select>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Metrics (enter numeric 0-100)</h3>
            {form.product === 'chimney' ? (
              <>
                <label className="block text-sm">Motor health</label>
                <input type="number" min="0" max="100" onChange={e => handleMetricChange('motorHealth', Number(e.target.value))} className="w-full p-2 rounded bg-black/20 mb-2" />
                <label className="block text-sm">Filter health</label>
                <input type="number" min="0" max="100" onChange={e => handleMetricChange('filterHealth', Number(e.target.value))} className="w-full p-2 rounded bg-black/20 mb-2" />
                <label className="block text-sm">Pressure (pcv) health</label>
                <input type="number" min="0" max="100" onChange={e => handleMetricChange('pcvHealth', Number(e.target.value))} className="w-full p-2 rounded bg-black/20 mb-2" />
                <label className="block text-sm">Touch health</label>
                <input type="number" min="0" max="100" onChange={e => handleMetricChange('touchHealth', Number(e.target.value))} className="w-full p-2 rounded bg-black/20 mb-2" />
                <label className="block text-sm">Sensor health</label>
                <input type="number" min="0" max="100" onChange={e => handleMetricChange('sensorHealth', Number(e.target.value))} className="w-full p-2 rounded bg-black/20 mb-2" />
              </>
            ) : (
              <>
                <label className="block text-sm">Burner health</label>
                <input type="number" min="0" max="100" onChange={e => handleMetricChange('burnerHealth', Number(e.target.value))} className="w-full p-2 rounded bg-black/20 mb-2" />
                <label className="block text-sm">Litre health</label>
                <input type="number" min="0" max="100" onChange={e => handleMetricChange('litreHealth', Number(e.target.value))} className="w-full p-2 rounded bg-black/20 mb-2" />
                <label className="block text-sm">Jet health</label>
                <input type="number" min="0" max="100" onChange={e => handleMetricChange('jetHealth', Number(e.target.value))} className="w-full p-2 rounded bg-black/20 mb-2" />
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button disabled={loading} type="submit" className="px-4 py-2 rounded bg-brand font-semibold">Create Report & QR</button>
            <button type="button" onClick={() => { setForm({clientName:'',clientNumber:'',address:'',product:'chimney',cleaningType:'normal',metrics:{}}); setMessage(null) }} className="px-4 py-2 rounded border">Reset</button>
          </div>

          {message && <div className="mt-4 p-3 bg-white/5 rounded">{message}</div>}
        </form>
      </main>
    </div>
  )
}
