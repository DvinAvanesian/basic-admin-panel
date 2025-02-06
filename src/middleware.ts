import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// middleware for setting sid for the user on the first request

export const middleware = (request: NextRequest) => {
  let sid = request.cookies.get('sid')

  if (!sid) {
    const response = NextResponse.next()
    response.cookies.set('sid', crypto.randomUUID())
    return response
  }

  return NextResponse.next()
}
