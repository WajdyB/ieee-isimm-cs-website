import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { GridFSBucket, ObjectId } from 'mongodb'

const BUCKET_NAME = 'specification-books'

type Context = { params: Promise<{ id: string }> }

// GET - Serve the PDF specification book
export async function GET(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = params.id

    if (!id || typeof id !== 'string') {
      return new Response('Invalid ID', { status: 400 })
    }

    const db = await getDb()
    const bucket = new GridFSBucket(db, { bucketName: BUCKET_NAME })
    const _id = new ObjectId(id)

    const files = await db.collection(`${BUCKET_NAME}.files`).find({ _id }).toArray()
    if (!files || files.length === 0) {
      return new Response('Not found', { status: 404 })
    }

    const file = files[0]
    const stream = bucket.openDownloadStream(_id)

    return new Response(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': file.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(file.filename || 'specification.pdf')}"`,
      },
    })
  } catch (error) {
    console.error('Error fetching specification:', error)
    return new Response('Error fetching file', { status: 500 })
  }
}
