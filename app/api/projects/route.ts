import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all project assignments (with optional memberId filter)
// Returns assignments joined with available project data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    const db = await getDb()
    const matchStage: Record<string, unknown> = {}
    if (memberId && ObjectId.isValid(memberId)) {
      matchStage.memberIds = new ObjectId(memberId)
    }

    const pipeline: object[] = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      { $sort: { created_at: -1 } },
      {
        $lookup: {
          from: 'available_projects',
          localField: 'availableProjectId',
          foreignField: '_id',
          as: 'availableProject',
        },
      },
      { $unwind: { path: '$availableProject', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          title: { $ifNull: ['$availableProject.title', '$title'] },
          overview: { $ifNull: ['$availableProject.overview', '$description'] },
          description: { $ifNull: ['$availableProject.overview', '$description'] },
          specificationBook: '$availableProject.specificationBook',
        },
      },
    ]

    const projects = await db.collection('projects').aggregate(pipeline).toArray()

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

// POST create new assignment (assign available project to members)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { availableProjectId, deadline, memberIds = [] } = body

    if (!availableProjectId || !deadline) {
      return NextResponse.json(
        { success: false, message: 'Available project and deadline are required' },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(availableProjectId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid available project ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const avail = await db.collection('available_projects').findOne({ _id: new ObjectId(availableProjectId) })
    if (!avail) {
      return NextResponse.json(
        { success: false, message: 'Available project not found' },
        { status: 404 }
      )
    }

    const now = new Date()
    const project = {
      availableProjectId: new ObjectId(availableProjectId),
      deadline: new Date(deadline),
      memberIds: (memberIds || []).map((id: string) => new ObjectId(id)),
      submissions: [],
      created_at: now,
      updated_at: now,
    }

    const result = await db.collection('projects').insertOne(project)
    const inserted = await db.collection('projects').findOne({ _id: result.insertedId })
    const withTitle = { ...inserted, title: avail.title, overview: avail.overview }

    return NextResponse.json({
      success: true,
      data: withTitle,
      message: 'Project assigned successfully',
    })
  } catch (error) {
    console.error('Error creating project assignment:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create assignment',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
