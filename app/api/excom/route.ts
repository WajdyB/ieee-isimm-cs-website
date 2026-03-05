import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all excom members (public - for committee page)
export async function GET() {
  try {
    const db = await getDb()
    const members = await db
      .collection('excom')
      .find({})
      .sort({ order: 1, created_at: 1 })
      .toArray()

    return NextResponse.json({ success: true, data: members })
  } catch (error) {
    console.error('Error fetching excom:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch excom members',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST new excom member (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.position) {
      return NextResponse.json(
        { success: false, message: 'Name and position are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const now = new Date()

    const member = {
      name: body.name,
      position: body.position,
      image: body.image || null,
      facebook: body.facebook || '',
      email: body.email || '',
      linkedin: body.linkedin || '',
      order: typeof body.order === 'number' ? body.order : 999,
      mandate: body.mandate || null,
      created_at: now,
      updated_at: now,
    }

    const result = await db.collection('excom').insertOne(member)

    return NextResponse.json({
      success: true,
      data: { ...member, _id: result.insertedId },
      message: 'Excom member created successfully',
    })
  } catch (error) {
    console.error('Error creating excom member:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create excom member',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
