import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import ProgressCircle from '../../components/ProgressCircle'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FaHeartbeat, FaTools, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'


export default function ReportPage() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const warrantyRef = useRef(null)

  useEffect(() => {
    if (!id) return
    async function fetch() {
      setLoading(true)
      try {
        const res = await axios.get(`/api/reports/${id}`)
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-br from-blue-900 to-indigo-900">
        Loading report...
      </div>
    )
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-br from-blue-900 to-indigo-900">
        Report not found
      </div>
    )

  // Warranty start and end calculate
  const startDate = new Date(data.createdAt)
  const start = startDate.toISOString().split("T")[0]
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + 1)
  const end = endDate.toISOString().split("T")[0]

  const handleDownload = async () => {
    if (!warrantyRef.current) return
    const canvas = await html2canvas(warrantyRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`Warranty-Card-${data.clientName || 'Client'}.pdf`)
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 min-h-screen text-white">
      <Header title={`Health Report — ${data.clientName}`} />

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
        {/* top section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-md mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold truncate">{data.clientName}</h1>
              <p className="text-md opacity-90 mt-2">
                <FaHeartbeat className="inline mr-2 text-red-400" />
                {data.clientNumber}
              </p>
              <p className="text-md opacity-90 mt-1">
                <FaTools className="inline mr-2 text-green-400" />
                {data.address}
              </p>
              <p className="text-sm opacity-80 mt-2">
                Product: <strong>{data.product}</strong> • Cleaning: <strong>{data.cleaningType}</strong>
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={data.qrDataUrl}
                alt="QR Code"
                className="w-24 h-24 sm:w-28 sm:h-28 bg-white p-2 rounded-2xl shadow-lg"
              />
              <p className="text-xs opacity-70 mt-2">Scan to verify report</p>
            </div>
          </div>
        </motion.section>

        {/* metrics */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="bg-white/10 p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-md mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b border-white/30 pb-3">Health Metrics Overview</h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            {Object.entries(data.metrics || {}).map(([key, value], idx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white/20 p-4 rounded-2xl shadow-lg flex flex-col items-center text-center"
              >
                <FaHeartbeat className="text-4xl text-red-400 mb-4 animate-pulse" />
                <ProgressCircle percent={value} label={key.charAt(0).toUpperCase() + key.slice(1)} size={100} />
                
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* warnings + warranty card */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="bg-white/10 p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-md"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b border-white/30 pb-3">Warnings & Actions</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* warnings */}
            <div
              className={`flex items-center gap-4 p-4 rounded-2xl shadow-lg ${
                data.currentScore <= 25 ? 'bg-red-900/80' :
                data.currentScore <= 50 ? 'bg-yellow-800/70' : 'bg-green-800/70'
              }`}
            >
              <FaExclamationTriangle className="text-3xl animate-bounce" />
              <div className="text-sm sm:text-base">
                {data.currentScore <= 25 ? (
                  <p>
                    Critical: Immediate service required.{' '}
                    <a href={`tel:+91${data.clientNumber}`} className="underline text-blue-300">Call now</a>
                  </p>
                ) : data.currentScore <= 50 ? (
                  <p>Warning: Consider service in the next 2–4 weeks.</p>
                ) : (
                  <p><FaCheckCircle className="inline text-green-300 mr-2"/> All systems operational.</p>
                )}
              </div>
            </div>

            {/* warranty card inline */}
            <div ref={warrantyRef} className="w-full sm:w-96 bg-white rounded-2xl shadow-xl border overflow-hidden text-sm sm:text-base">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-5 flex justify-between items-center">
                <h2 className="text-white font-bold text-lg tracking-wide">CHIMNEY SOLUTIONS</h2>
                <div className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full shadow">
                  1 MONTH WARRANTY
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-blue-700">Warranty Certificate</h3>
                  <p className="text-gray-500 text-sm">
                    Serial: {data.serial || "—"} • Model: {data.model || "—"}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-y-3 text-gray-800">
                  <p className="font-medium">Customer Name:</p>
                  <p className="col-span-2">{data.clientName}</p>

                  <p className="font-medium">Address:</p>
                  <p className="col-span-2">{data.address}</p>

                  <p className="font-medium">Phone No.:</p>
                  <p className="col-span-2">{data.clientNumber}</p>

                  <p className="font-medium">Warranty Start:</p>
                  <p className="col-span-2">{start}</p>

                  <p className="font-medium">Warranty End:</p>
                  <p className="col-span-2">{end}</p>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div>
                    <p className="text-gray-600 text-sm">Authorized Sign:</p>
                    <div className="border-t border-gray-400 w-36 mt-6 relative ">
                      <div className='mt-[-20px] rotate-[11deg]'>
                        <img 
                          src="/sg.png"
                          alt="Signature"
                          className="absolute -top-12 left-0 w-32 h-auto" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <img
                      src={data.qrDataUrl}
                      alt="QR Code"
                      className="w-20 h-20 bg-white p-2 rounded-2xl shadow"
                    />
                    <p className="text-xs text-gray-500 mt-1">Scan to Register</p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs">Date: {start}</p>
              </div>

              {/* Footer with full Terms */}
              <div className="bg-gray-100 px-6 py-4 text-xs text-gray-700 text-left border-t border-gray-300">
                <p className="font-semibold text-red-600 mb-1 text-center">
                  Terms & Conditions
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-snug">
                  <li>This warranty is valid for <strong>1 month only</strong>. After that, standard service charges will apply.</li>
                  <li>This warranty strictly covers only <strong>service-related issues</strong> performed by our technician (such as suction problems, oil leakage, or service-related faults).</li>
                  <li>Warranty is applicable only to the <strong>workmanship and service</strong> provided during the visit.</li>
                  <li><strong>No warranty</strong> is provided on spare parts, components, or the overall health card.</li>
                  <li>Any new issues unrelated to the technician’s service will be treated as a <strong>fresh service request</strong>.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleDownload}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md"
            >
              Download Warranty Card
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
