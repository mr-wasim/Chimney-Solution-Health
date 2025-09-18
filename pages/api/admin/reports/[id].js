// pages/api/admin/reports/[id].js
import { connectToDatabase } from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  const { db } = await connectToDatabase(process.env.MONGODB_URI)
  const { id } = req.query

  try {
    if (req.method === 'PUT') {
      const data = req.body
      const result = await db.collection('reports').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' }
      )

      if (!result.value) {
        return res.status(404).json({ error: 'Report not found' })
      }

      return res.status(200).json({ success: true, report: result.value })
    }

    if (req.method === 'DELETE') {
      const result = await db.collection('reports').deleteOne({
        _id: new ObjectId(id),
      })

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Report not found' })
      }

      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db fail' })
  }
}
