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
    // If we have a valid client and db, return it
    if (client && db) {
      // Test if the connection is still alive
      try {
        await client.db().admin().ping()
        return db
      } catch (error) {
        console.log('Connection lost, reconnecting...')
        client = null
        db = null
      }
    }

    // Create new connection
    console.log('Connecting to MongoDB...')
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
    }
    
    client = new MongoClient(mongoUri, options)
    await client.connect()
    console.log('MongoDB connected successfully')
    
    db = client.db() // Use default database from URI
    return db
  } catch (error) {
    console.error('MongoDB connection error:', error)
    // Reset connection state on error
    client = null
    db = null
    throw error
  }
}

// Graceful shutdown function
export async function closeConnection() {
  if (client) {
    try {
      await client.close()
      console.log('MongoDB connection closed')
    } catch (error) {
      console.error('Error closing MongoDB connection:', error)
    } finally {
      client = null
      db = null
    }
  }
} 