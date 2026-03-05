import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type Context = { params: Promise<{ id: string }> }

// PUT - update excom member
export async function PUT(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const db = await getDb()

    const update: Record<string, unknown> = {
      updated_at: new Date(),
    }
    if (body.name !== undefined) update.name = body.name
    if (body.position !== undefined) update.position = body.position
    if (body.image !== undefined) update.image = body.image
    if (body.facebook !== undefined) update.facebook = body.facebook
    if (body.email !== undefined) update.email = body.email
    if (body.linkedin !== undefined) update.linkedin = body.linkedin
    if (body.order !== undefined) update.order = body.order
    if (body.mandate !== undefined) update.mandate = body.mandate

    const result = await db.collection('excom').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' as const }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Excom member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Excom member updated successfully',
    })
  } catch (error) {
    console.error('Error updating excom member:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update excom member',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// DELETE - remove excom member
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection('excom').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Excom member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Excom member deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting excom member:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete excom member',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
