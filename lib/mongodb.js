import { MongoClient } from 'mongodb'

let cachedClient = null
let cachedDb = null

export async function connectToDatabase(uri) {
  if (!uri) throw new Error('Please provide MONGODB_URI')

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db('chimney_solutions_db')
  cachedClient = client
  cachedDb = db
  return { client, db }
}
