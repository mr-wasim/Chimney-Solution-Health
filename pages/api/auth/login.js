import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { user, pass } = req.body
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'Chimeny@123'

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    const token = jwt.sign({ user: ADMIN_USER }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' })
    return res.status(200).json({ token })
  }
  return res.status(401).json({ error: 'invalid' })
}
