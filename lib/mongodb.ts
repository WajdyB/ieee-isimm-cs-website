import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('MONGODB_URI is not defined in environment variables')
  throw new Error('MONGODB_URI is not defined in environment variables')
}

// At this point, uri is guaranteed to be a string
const mongoUri: string = uri

let client: MongoClient | null = null
let db: Db | null = null

export async function getDb(): Promise<Db> {
  try {
    if (db) return db
    if (!client) {
      console.log('Connecting to MongoDB...')
      client = new MongoClient(mongoUri)
      await client.connect()
      console.log('MongoDB connected successfully')
    }
    db = client.db() // Use default database from URI
    return db
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
} 