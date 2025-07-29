import { NextResponse } from 'next/server'

export async function GET() {
  const uri = process.env.MONGODB_URI || ''
  
  return NextResponse.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: uri.length,
    mongoUriStartsWith: uri.substring(0, 20) + '...',
    mongoUriEndsWith: uri.substring(uri.length - 20),
    hasDatabaseName: uri.includes('/ieee-cs-isimm?'),
    hasRetryWrites: uri.includes('retryWrites=true'),
    hasWMajority: uri.includes('w=majority'),
    nodeEnv: process.env.NODE_ENV,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
  })
} 