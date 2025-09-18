import { connectToDatabase } from '../../../lib/mongodb'
import QRCode from 'qrcode'

function computeInitialScore(metrics) {
  const vals = Object.values(metrics).filter(v => typeof v === 'number' && !isNaN(v))
  if (vals.length === 0) return 50
  const sum = vals.reduce((a,b)=>a+b,0)
  return Math.round(sum / vals.length)
}

// Compute warranty expiry: 1 month from created date
function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const body = req.body
  // Basic validation
  if (!body.clientName || !body.clientNumber || !body.product) return res.status(400).json({ error: 'missing fields' })

  const initialScore = computeInitialScore(body.metrics || {})
  const createdAt = new Date()
  const warrantyExpires = addMonths(createdAt, 1)

  const payload = {
    clientName: body.clientName,
    clientNumber: body.clientNumber,
    address: body.address || '',
    product: body.product,
    cleaningType: body.cleaningType || 'normal',
    metrics: body.metrics || {},
    initialScore,
    createdAt,
    warrantyExpires,
    visits: 0
  }

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI)
    const insert = await db.collection('reports').insertOne(payload)
    const id = insert.insertedId.toString()

    // generate QR that points to public report page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const target = `${appUrl}/report/${id}`
    const qrDataUrl = await QRCode.toDataURL(target, { margin: 2, scale: 6 })

    // store qrDataUrl in db
    await db.collection('reports').updateOne({ _id: insert.insertedId }, { $set: { qrDataUrl } })

    res.status(200).json({ id, qrDataUrl })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db error' })
  }
}
