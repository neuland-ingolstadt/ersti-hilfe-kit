import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SCAVENGER_HUNT_DISABLED = process.env.SCAVENGER_HUNT_DISABLED === 'true'

export function middleware(request: NextRequest) {
  if (SCAVENGER_HUNT_DISABLED) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/scavenger/:path*',
}
