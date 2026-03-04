import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

// GET all members (sorted by XP)
export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    
    let query = db.collection('members').find({}).sort({ xp: -1 })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const members = await query.toArray()
    
    // Remove passwords from response
    const sanitizedMembers = members.map(({ password, ...member }) => member)
    
    return NextResponse.json({ 
      success: true, 
      data: sanitizedMembers
    })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch members', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Create new member
export async function POST(request: NextRequest) {
  try {
    const memberData = await request.json()

    // Validate required fields
    if (!memberData.firstName || !memberData.lastName || !memberData.email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: firstName, lastName, email' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    // Check if email already exists
    const existingMember = await db.collection('members').findOne({ email: memberData.email })
    if (existingMember) {
      return NextResponse.json(
        { success: false, message: 'Member with this email already exists' },
        { status: 400 }
      )
    }

    // Generate temporary password (8 characters)
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const now = new Date()
    const member = {
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      password: hashedPassword,
      xp: memberData.xp || 0,
      level: calculateLevel(memberData.xp || 0),
      joinDate: now,
      lastActivity: now,
      achievements: [],
      rewards: [],
      rewardsRedeemed: [],
      activityHistory: [],
      created_at: now,
      updated_at: now
    }

    const result = await db.collection('members').insertOne(member)
    
    // TODO: Send email with credentials using Resend API
    // For now, return the temp password (in production, only send via email)
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        ...member, 
        _id: result.insertedId,
        tempPassword: tempPassword // Remove this in production
      },
      message: 'Member created successfully. Credentials should be sent via email.' 
    })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create member', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to calculate level based on XP
function calculateLevel(xp: number): number {
  // Simple level calculation: 100 XP per level
  return Math.floor(xp / 100) + 1
}
