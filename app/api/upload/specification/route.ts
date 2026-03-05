import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { GridFSBucket } from 'mongodb'

const BUCKET_NAME = 'specification-books'

// POST - Upload a single PDF specification book
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, message: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Max 20MB for specification books
    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 20MB' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const bucket = new GridFSBucket(db, { bucketName: BUCKET_NAME })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
    })
    uploadStream.end(buffer)

    await new Promise<void>((resolve, reject) => {
      uploadStream.on('finish', () => resolve())
      uploadStream.on('error', reject)
    })

    const id = uploadStream.id.toString()
    const url = `/api/upload/specification/${id}`

    return NextResponse.json({
      success: true,
      message: 'Specification book uploaded successfully',
      url,
      id,
      filename: file.name,
    })
  } catch (error) {
    console.error('Error uploading specification:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
