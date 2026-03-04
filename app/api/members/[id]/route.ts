import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type Context = { params: Promise<{ id: string }> }

// GET single member
export async function GET(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const memberId = params.id
    
    if (!ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid member ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const member = await db.collection('members').findOne({ _id: new ObjectId(memberId) })
    
    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      )
    }

    // Remove password from response
    const { password, ...sanitizedMember } = member
    
    return NextResponse.json({
      success: true,
      data: sanitizedMember
    })
  } catch (error) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch member',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - Update member
export async function PUT(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const memberId = params.id
    
    if (!ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid member ID' },
        { status: 400 }
      )
    }

    const updateData = await request.json()
    const db = await getDb()
    
    // Calculate new level if XP is being updated
    if (updateData.xp !== undefined) {
      updateData.level = Math.floor(updateData.xp / 100) + 1
    }
    
    updateData.updated_at = new Date()
    updateData.lastActivity = new Date()
    
    // Don't allow direct password updates through this route
    delete updateData.password

    const result = await db.collection('members').updateOne(
      { _id: new ObjectId(memberId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      )
    }

    const updatedMember = await db.collection('members').findOne({ _id: new ObjectId(memberId) })
    const { password, ...sanitizedMember } = updatedMember!

    return NextResponse.json({
      success: true,
      data: sanitizedMember,
      message: 'Member updated successfully'
    })
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update member',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE member
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const memberId = params.id
    
    if (!ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid member ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection('members').deleteOne({ _id: new ObjectId(memberId) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete member',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
