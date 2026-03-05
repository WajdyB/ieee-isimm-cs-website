import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// Single document in xp_guide collection, identified by type
const GUIDE_FILTER = { type: 'main' }

// GET - Fetch the XP guide (public, used by members and admin)
export async function GET() {
  try {
    const db = await getDb()
    const guide = await db.collection('xp_guide').findOne(GUIDE_FILTER)

    return NextResponse.json({
      success: true,
      data: guide ? { content: guide.content || '', updatedAt: guide.updated_at } : { content: '', updatedAt: null },
    })
  } catch (error) {
    console.error('Error fetching XP guide:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch XP guide',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// PUT - Update the XP guide (admin)
export async function PUT(request: NextRequest) {
  try {
    const { content } = await request.json()

    const db = await getDb()
    const now = new Date()

    await db.collection('xp_guide').updateOne(
      GUIDE_FILTER,
      { $set: { type: 'main', content: content || '', updated_at: now } },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'XP guide updated successfully',
      data: { content: content || '', updatedAt: now },
    })
  } catch (error) {
    console.error('Error updating XP guide:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update XP guide',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
