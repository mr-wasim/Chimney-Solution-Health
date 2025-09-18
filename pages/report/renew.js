import dbConnect from '../../../../lib/mongodb'
import Report from '../../../../models/Report'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'POST') {
    const { id } = req.body
    try {
      const report = await Report.findById(id)
      if (!report) return res.status(404).json({ error: 'Not found' })

      report.initialScore = 100
      report.visits = (report.visits || 0) + 1
      report.lastServiceDate = new Date()

      await report.save()
      return res.json(report)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  res.status(405).end()
}
