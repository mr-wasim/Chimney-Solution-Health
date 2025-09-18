// pages/api/admin/reports/index.js
import { connectToDatabase } from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// -------- Admin role check helper --------
function isAdmin(req) {
  return req.user && req.user.role === 'admin'
}

export default async function handler(req, res) {
  const { db } = await connectToDatabase(process.env.MONGODB_URI)

  try {
    // ---- GET : fetch all reports ----
    if (req.method === 'GET') {
      const reports = await db.collection('reports').find().toArray()
      return res.status(200).json(reports)
    }

    // ---- POST : create new report ----
    if (req.method === 'POST') {
      const data = req.body
      const result = await db.collection('reports').insertOne({
        ...data,
        createdAt: new Date(),
        visits: 0,
        renewals: 0,
        updatedAt: new Date()
      })
      return res.status(201).json({ success: true, id: result.insertedId })
    }

    // ---- PUT : update report (edit by admin) ----
    if (req.method === 'PUT') {
      if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden: Admins only' })

      const { id, ...data } = req.body
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid or missing ID' })
      }

      // Allowed fields (safety)
      const allowedFields = ['clientName', 'product', 'initialScore', 'cleaningType', 'notes']
      const updateData = {}
      for (let key of allowedFields) {
        if (data[key] !== undefined) updateData[key] = data[key]
      }
      updateData.updatedAt = new Date()

      const result = await db.collection('reports').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Report not found for update' })
      }

      const updated = await db.collection('reports').findOne({ _id: new ObjectId(id) })
      return res.status(200).json({ success: true, report: updated })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db fail', details: err.message })
  }
}
