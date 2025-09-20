import { useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'

export default function Technician() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    clientName: '',
    clientNumber: '',
    address: '',
    product: 'chimney',
    cleaningType: 'normal',
    modelName: '', // ✅ new field
    metrics: {}
  })
  const [message, setMessage] = useState(null)
  const [qrData, setQrData] = useState(null) // ✅ store QR + ID

  function handleMetricChange(key, value) {
    setForm(s => ({ ...s, metrics: { ...s.metrics, [key]: value } }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/reports/create', form)
      const { id, qrDataUrl } = res.data
      setMessage('Report created successfully!')
      setQrData({ id, qrDataUrl }) // ✅ save for download/view
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
          <input required value={form.clientName} 
            onChange={e => setForm({ ...form, clientName: e.target.value })} 
            className="w-full p-3 rounded bg-black/30 mb-3" />

          <label className="block mb-2 text-sm">Client number</label>
          <input required value={form.clientNumber} 
            onChange={e => setForm({ ...form, clientNumber: e.target.value })} 
            className="w-full p-3 rounded bg-black/30 mb-3" />

          <label className="block mb-2 text-sm">Address</label>
          <input value={form.address} 
            onChange={e => setForm({ ...form, address: e.target.value })} 
            className="w-full p-3 rounded bg-black/30 mb-3" />

          {/* ✅ New model name field */}
          <label className="block mb-2 text-sm">Model Name</label>
          <input value={form.modelName} 
            onChange={e => setForm({ ...form, modelName: e.target.value })} 
            placeholder="e.g. Chimney X200 / Hob 4B" 
            className="w-full p-3 rounded bg-black/30 mb-3" />

          <label className="block mb-2 text-sm">Product</label>
          <select value={form.product} 
            onChange={e => setForm({ ...form, product: e.target.value })} 
            className="w-full p-3 rounded bg-black/30 mb-4">
            <option value="chimney">Chimney</option>
            <option value="hob">Hob</option>
          </select>

          <label className="block mb-2 text-sm">Cleaning type</label>
          <select value={form.cleaningType} 
            onChange={e => setForm({ ...form, cleaningType: e.target.value })} 
            className="w-full p-3 rounded bg-black/30 mb-4">
            <option value="normal">Normal cleaning (6 months decay)</option>
            <option value="deep">Deep cleaning (8 months decay)</option>
          </select>

          {/* ✅ Metrics Section */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Metrics (0-100)</h3>
            {form.product === 'chimney' ? (
              <>
                <label className="block text-sm">PCB health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('pcbHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />

                <label className="block text-sm">Blower health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('blowerHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />

                <label className="block text-sm">Suction health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('suctionHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />

                <label className="block text-sm">Product Structure health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('structureHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />

                {/* ✅ NEW */}
                <label className="block text-sm">Motor health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('motorHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />

                <label className="block text-sm">Filter health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('filterHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />
              </>
            ) : (
              <>
                <label className="block text-sm">Flame Burner health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('flameBurnerHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />

                <label className="block text-sm">Ignition health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('ignitionHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />

                <label className="block text-sm">Components health</label>
                <input type="number" min="0" max="100"
                  onChange={e => handleMetricChange('componentsHealth', Number(e.target.value))}
                  className="w-full p-2 rounded bg-black/20 mb-2" />
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button disabled={loading} type="submit" 
              className="px-4 py-2 rounded bg-brand font-semibold">
              {loading ? 'Loading…' : 'Create Report & QR'}
            </button>
            <button type="button" 
              onClick={() => { 
                setForm({
                  clientName:'',
                  clientNumber:'',
                  address:'',
                  product:'chimney',
                  cleaningType:'normal',
                  modelName:'',
                  metrics:{}
                }) 
                setMessage(null)
                setQrData(null)
              }} 
              className="px-4 py-2 rounded border">
              Reset
            </button>
          </div>

          {message && <div className="mt-4 p-3 bg-white/5 rounded">{message}</div>}

          {/* ✅ Show QR + options */}
          {qrData && (
            <div className="mt-6 p-4 bg-black/20 rounded text-center">
              <img src={qrData.qrDataUrl} alt="QR Code" className="mx-auto mb-4 w-40 h-40" />
              <div className="flex justify-center gap-4">
                <a href={qrData.qrDataUrl} download="report-qr.png" 
                   className="px-4 py-2 bg-green-600 rounded text-white">Download QR</a>
                <a href={`/report/${qrData.id}`} 
                   className="px-4 py-2 bg-blue-600 rounded text-white">View Report</a>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  )
}
