import { NextResponse, type NextRequest } from 'next/server'
import { DEMO_COOKIE } from '@/lib/demo'

const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/terms-of-service',
  '/privacy-policy',
  '/api',
  '/_next',
  '/auth',
]

// The guest demo cookie is the only session: it opens the dashboard, every
// other protected page goes to the login page.
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname === '/' ||
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    (request.cookies.get(DEMO_COOKIE)?.value === '1' &&
      pathname.startsWith('/dashboard'))
  ) {
    return NextResponse.next({ request })
  }

  const url = request.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}
