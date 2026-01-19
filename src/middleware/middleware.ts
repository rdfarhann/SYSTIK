import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const isAdminRoute = pathname.startsWith('/dashboard/admin')
  const isUserDashboardOnly = pathname === '/dashboard' 
  const isAnyDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/login' || pathname === '/'

  let userRole = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role?.toLowerCase() 
  }


  if (user && isLoginPage) {
    return NextResponse.redirect(new URL(userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard', request.url))
  }

  
  if (!user && isAnyDashboardRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (user && isAdminRoute && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (user && isUserDashboardOnly && userRole === 'ADMIN') {
     return NextResponse.redirect(new URL('/dashboard/ADMIN', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}