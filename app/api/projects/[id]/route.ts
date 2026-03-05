import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type Context = { params: Promise<{ id: string }> }

// GET single project
export async function GET(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid project ID' }, { status: 400 })
    }

    const db = await getDb()
    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
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
    const result = await db.collection('projects').aggregate(pipeline).toArray()
    const project = result[0]

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid project ID' }, { status: 400 })
    }

    const body = await request.json()
    const { deadline, memberIds } = body

    const db = await getDb()
    const updateData: Record<string, unknown> = { updated_at: new Date() }

    if (deadline !== undefined) updateData.deadline = new Date(deadline)
    if (memberIds !== undefined) {
      updateData.memberIds = memberIds.map((mid: string) => new ObjectId(mid))
    }

    const result = await db
      .collection('projects')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
    }

    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
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
    const updated = await db.collection('projects').aggregate(pipeline).toArray()
    return NextResponse.json({ success: true, data: updated[0], message: 'Project updated' })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid project ID' }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
