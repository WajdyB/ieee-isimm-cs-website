import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type Context = { params: Promise<{ id: string }> }

// PUT - Update reward
export async function PUT(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid reward ID' }, { status: 400 })
    }

    const body = await request.json()
    const { requiredXP, title, description, icon, order } = body

    const db = await getDb()
    const updateData: Record<string, unknown> = { updated_at: new Date() }

    if (typeof requiredXP === 'number' && requiredXP >= 0) updateData.requiredXP = requiredXP
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (icon !== undefined) updateData.icon = icon
    if (typeof order === 'number') updateData.order = order

    const result = await db
      .collection('rewards')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Reward not found' }, { status: 404 })
    }

    const reward = await db.collection('rewards').findOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true, data: reward, message: 'Reward updated' })
  } catch (error) {
    console.error('Error updating reward:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update reward',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove reward
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid reward ID' }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection('rewards').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Reward not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Reward deleted' })
  } catch (error) {
    console.error('Error deleting reward:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete reward',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
