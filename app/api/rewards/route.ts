import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// GET - Fetch all rewards, sorted by requiredXP ascending
export async function GET() {
  try {
    const db = await getDb()
    const rewards = await db
      .collection('rewards')
      .find({})
      .sort({ requiredXP: 1, order: 1 })
      .toArray()

    return NextResponse.json({ success: true, data: rewards })
  } catch (error) {
    console.error('Error fetching rewards:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch rewards',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST - Create new reward (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requiredXP, title, description, icon = '🎁', order = 0 } = body

    if (!title || typeof requiredXP !== 'number' || requiredXP < 0) {
      return NextResponse.json(
        { success: false, message: 'Title and requiredXP (number >= 0) are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const now = new Date()

    const reward = {
      requiredXP,
      title,
      description: description || '',
      icon: icon || '🎁',
      order: typeof order === 'number' ? order : 0,
      created_at: now,
      updated_at: now,
    }

    const result = await db.collection('rewards').insertOne(reward)

    return NextResponse.json({
      success: true,
      data: { ...reward, _id: result.insertedId },
      message: 'Reward created successfully',
    })
  } catch (error) {
    console.error('Error creating reward:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create reward',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
