import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    const db = await getDb()
    let query = {}

    if (memberId && ObjectId.isValid(memberId)) {
      query = { memberIds: new ObjectId(memberId) }
    }

    const projects = await db
      .collection('projects')
      .find(query)
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch projects',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, deadline, memberIds = [] } = body

    if (!title || !description || !deadline) {
      return NextResponse.json(
        { success: false, message: 'Title, description, and deadline are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const now = new Date()

    const project = {
      title,
      description,
      deadline: new Date(deadline),
      memberIds: (memberIds || []).map((id: string) => new ObjectId(id)),
      submissions: [],
      created_at: now,
      updated_at: now,
    }

    const result = await db.collection('projects').insertOne(project)

    return NextResponse.json({
      success: true,
      data: { ...project, _id: result.insertedId },
      message: 'Project created successfully',
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
