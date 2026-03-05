import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

const CATEGORIES = ['web_development', 'mobile_development', 'software_engineering'] as const

// GET all available projects (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const db = await getDb()
    const query: Record<string, unknown> = {}
    if (category && CATEGORIES.includes(category as typeof CATEGORIES[number])) {
      query.category = category
    }

    const projects = await db
      .collection('available_projects')
      .find(query)
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching available projects:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch available projects',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST create new available project (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, title, overview, technologies, domain, estimatedTime, specificationBook } = body

    if (!category || !title || !overview) {
      return NextResponse.json(
        { success: false, message: 'Category, title, and overview are required' },
        { status: 400 }
      )
    }

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, message: 'Invalid category. Use: web_development, mobile_development, software_engineering' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const now = new Date()

    const technologiesArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
        ? technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
        : []

    const project = {
      category,
      title,
      overview,
      technologies: technologiesArray,
      domain: domain || '',
      estimatedTime: estimatedTime || '',
      specificationBook: specificationBook || '',
      created_at: now,
      updated_at: now,
    }

    const result = await db.collection('available_projects').insertOne(project)

    return NextResponse.json({
      success: true,
      data: { ...project, _id: result.insertedId },
      message: 'Available project created successfully',
    })
  } catch (error) {
    console.error('Error creating available project:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create available project',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
