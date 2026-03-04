import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type Context = { params: Promise<{ id: string }> }

// POST submit GitHub repo for a project (member)
export async function POST(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const projectId = params.id

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ success: false, message: 'Invalid project ID' }, { status: 400 })
    }

    const { memberId, githubRepo } = await request.json()

    if (!memberId || !githubRepo) {
      return NextResponse.json(
        { success: false, message: 'Member ID and GitHub repo URL are required' },
        { status: 400 }
      )
    }

    const repoUrl = (githubRepo as string).trim()
    if (!repoUrl.startsWith('https://github.com/')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid GitHub repository URL' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) })

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
    }

    const memberObjectId = new ObjectId(memberId)
    const isAssigned = project.memberIds?.some(
      (mid: unknown) => (mid as ObjectId).toString() === memberId
    )

    if (!isAssigned) {
      return NextResponse.json(
        { success: false, message: 'You are not assigned to this project' },
        { status: 403 }
      )
    }

    const deadline = new Date(project.deadline)
    if (new Date() > deadline) {
      return NextResponse.json(
        { success: false, message: 'Submission deadline has passed' },
        { status: 400 }
      )
    }

    const submissions = project.submissions || []
    const existingIndex = submissions.findIndex(
      (s: { memberId?: unknown }) => (s.memberId as ObjectId)?.toString() === memberId
    )

    const submission = {
      memberId: memberObjectId,
      githubRepo: repoUrl,
      submittedAt: new Date(),
    }

    const coll = db.collection('projects')
    if (existingIndex >= 0) {
      await coll.updateOne(
        { _id: new ObjectId(projectId) },
        { $set: { [`submissions.${existingIndex}`]: submission, updated_at: new Date() } }
      )
    } else {
      await coll.updateOne(
        { _id: new ObjectId(projectId) },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { $push: { submissions: submission }, $set: { updated_at: new Date() } } as any
      )
    }

    const updatedProject = await db.collection('projects').findOne({ _id: new ObjectId(projectId) })

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: existingIndex >= 0 ? 'Submission updated' : 'Submission received',
    })
  } catch (error) {
    console.error('Error submitting project:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
