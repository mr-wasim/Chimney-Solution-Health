// pages/api/admin/reports/[id].js
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// -------- score calculation ----------
function computeDegradedScore(initialScore, createdAtIso, cleaningType) {
  const created = new Date(createdAtIso)
  const now = new Date()
  const months = (now - created) / (1000 * 60 * 60 * 24 * 30)

  // normal: degrade over 6 months to 20%
  // deep: degrade over 8 months to 20%
  const duration = cleaningType === 'deep' ? 8 : 6
  const floor = 20

  if (months <= 0) return initialScore

  const t = Math.min(months / duration, 1)
  const degraded = Math.round(initialScore * (1 - t) + floor * t)
  return Math.max(0, degraded)
}

export default async function handler(req, res) {
  const { id } = req.query
  const { db } = await connectToDatabase(process.env.MONGODB_URI)

  try {
    // ---- GET : fetch single client report ----
    if (req.method === 'GET') {
      const obj = await db.collection('reports').findOne({ _id: new ObjectId(id) })
      if (!obj) return res.status(404).json({ error: 'not found' })

      // increment visit count
      await db.collection('reports').updateOne(
        { _id: obj._id },
        { $inc: { visits: 1 } }
      )

      const currentScore = computeDegradedScore(
        obj.initialScore,
        obj.createdAt,
        obj.cleaningType
      )

      return res.status(200).json({ ...obj, id: obj._id.toString(), currentScore })
    }

    // ---- PUT : update client report (admin edit) ----
    if (req.method === 'PUT') {
      const data = req.body
      await db.collection('reports').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
      )
      return res.status(200).json({ success: true, message: 'Report updated' })
    }

    // ---- DELETE : remove client report ----
    if (req.method === 'DELETE') {
      await db.collection('reports').deleteOne({ _id: new ObjectId(id) })
      return res.status(200).json({ success: true, message: 'Report deleted' })
    }

    // ---- POST : renew client report (reset score + date) ----
    if (req.method === 'POST') {
      const { newScore, cleaningType } = req.body
      await db.collection('reports').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            initialScore: newScore || 100,
            createdAt: new Date().toISOString(),
            cleaningType: cleaningType || 'normal',
            updatedAt: new Date()
          },
          $inc: { renewals: 1 }
        }
      )
      return res.status(200).json({ success: true, message: 'Report renewed' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'db fail' })
  }
}
