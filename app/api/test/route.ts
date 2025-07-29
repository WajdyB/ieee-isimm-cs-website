import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    
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
      nodeEnv: process.env.NODE_ENV
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV
    }, { status: 500 })
  }
} 