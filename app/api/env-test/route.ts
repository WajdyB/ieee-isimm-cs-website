import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI?.length || 0,
    mongoUriStartsWith: process.env.MONGODB_URI?.substring(0, 20) + '...',
    nodeEnv: process.env.NODE_ENV,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
  })
} 