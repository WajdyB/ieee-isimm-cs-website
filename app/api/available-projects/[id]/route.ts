import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const CATEGORIES = ['web_development', 'mobile_development', 'software_engineering'] as const

type Context = { params: Promise<{ id: string }> }

// PUT - Update available project
export async function PUT(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid project ID' }, { status: 400 })
    }

    const body = await request.json()
    const { category, title, overview, technologies, domain, estimatedTime, specificationBook } = body

    const db = await getDb()
    const updateData: Record<string, unknown> = { updated_at: new Date() }

    if (specificationBook !== undefined) updateData.specificationBook = specificationBook
    if (category !== undefined) {
      if (!CATEGORIES.includes(category)) {
        return NextResponse.json({ success: false, message: 'Invalid category' }, { status: 400 })
      }
      updateData.category = category
    }
    if (title !== undefined) updateData.title = title
    if (overview !== undefined) updateData.overview = overview
    if (technologies !== undefined) {
      updateData.technologies = Array.isArray(technologies)
        ? technologies
        : typeof technologies === 'string'
          ? technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
          : []
    }
    if (domain !== undefined) updateData.domain = domain
    if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime

    const result = await db
      .collection('available_projects')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
    }

    const project = await db.collection('available_projects').findOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true, data: project, message: 'Project updated' })
  } catch (error) {
    console.error('Error updating available project:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update project',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove available project
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid project ID' }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection('available_projects').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    console.error('Error deleting available project:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete project',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
