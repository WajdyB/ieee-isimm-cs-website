import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all events
export async function GET() {
  try {
    console.log('Fetching events from database...')
    const db = await getDb()
    console.log('Database connection established')
    
    const events = await db.collection('events').find({}).sort({ created_at: -1 }).toArray()
    console.log(`Found ${events.length} events`)
    
    return NextResponse.json({ 
      success: true, 
      data: events
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// POST new event
export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()

    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.date || !eventData.location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating new event...')
    const db = await getDb()
    const now = new Date()
    const event = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      location: eventData.location,
      attendees: eventData.attendees || 0,
      images: eventData.images || [],
      created_at: now,
      updated_at: now
    }
    const result = await db.collection('events').insertOne(event)
    console.log('Event created successfully with ID:', result.insertedId)
    
    return NextResponse.json({ 
      success: true, 
      data: { ...event, _id: result.insertedId },
      message: 'Event created successfully' 
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
} 