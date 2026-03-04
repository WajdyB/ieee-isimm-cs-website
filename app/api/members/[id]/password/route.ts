import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

type Context = { params: Promise<{ id: string }> }

// PUT - Change member password
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

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    // Get current member
    const member = await db.collection('members').findOne({ _id: new ObjectId(memberId) })
    
    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, member.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await db.collection('members').updateOne(
      { _id: new ObjectId(memberId) },
      { 
        $set: { 
          password: hashedPassword,
          updated_at: new Date()
        } 
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to change password',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
