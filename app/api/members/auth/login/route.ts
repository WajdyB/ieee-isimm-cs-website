import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const member = await db.collection('members').findOne({ email: email.toLowerCase() })

    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, member.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last activity
    await db.collection('members').updateOne(
      { _id: member._id },
      { $set: { lastActivity: new Date() } }
    )

    // Remove password from response
    const { password: _, ...sanitizedMember } = member

    return NextResponse.json({
      success: true,
      data: sanitizedMember,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Member login error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
