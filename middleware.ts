export const runtime = 'nodejs'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/pricing']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // Skip middleware for public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return response
  }

  // Create Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers }
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers }
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Check session
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to login if no session on protected routes
  if (!session && pathname.startsWith('/app')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
