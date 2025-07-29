import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    
    // Check URI format (without exposing the full URI)
    const uri = process.env.MONGODB_URI
    if (uri) {
      console.log('URI starts with:', uri.substring(0, 20) + '...')
      console.log('URI contains mongodb+srv:', uri.includes('mongodb+srv'))
      console.log('URI contains retryWrites:', uri.includes('retryWrites'))
    }
    
    const db = await getDb()
    console.log('Database connection successful')
    
    // Test query
    const events = await db.collection('events').find({}).limit(1).toArray()
    console.log('Test query successful, found events:', events.length)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      eventsCount: events.length,
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      uriFormat: uri ? {
        startsWith: uri.substring(0, 20) + '...',
        hasMongoSrv: uri.includes('mongodb+srv'),
        hasRetryWrites: uri.includes('retryWrites'),
        hasW: uri.includes('w=majority')
      } : null
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      uriFormat: process.env.MONGODB_URI ? {
        startsWith: process.env.MONGODB_URI.substring(0, 20) + '...',
        hasMongoSrv: process.env.MONGODB_URI.includes('mongodb+srv'),
        hasRetryWrites: process.env.MONGODB_URI.includes('retryWrites'),
        hasW: process.env.MONGODB_URI.includes('w=majority')
      } : null
    }, { status: 500 })
  }
} 