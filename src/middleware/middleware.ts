import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Definisikan response di awal
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Definisikan supabase client
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

  // 3. Ambil data user
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Logika pengecekan rute
  const isPasswordPage = pathname.startsWith('/password')
  const isLoginPage = pathname === '/login' || pathname === '/'
  const isAdminRoute = pathname.startsWith('/dashboard/admin')
  const isUserDashboardOnly = pathname === '/dashboard' 
  const isAnyDashboardRoute = pathname.startsWith('/dashboard')

  // --- SOLUSI UTAMA AGAR TIDAK KE LOGIN FORM ---
  if (isPasswordPage) {
    return response
  }

  let userRole = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role?.toUpperCase() 
  }

  // Pengalihan jika sudah login
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL(userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard', request.url))
  }

  // Proteksi rute dashboard
  if (!user && isAnyDashboardRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Proteksi Admin Role
  if (user && isAdminRoute && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect Admin yang nyasar ke dashboard user
  if (user && isUserDashboardOnly && userRole === 'ADMIN') {
     return NextResponse.redirect(new URL('/dashboard/admin', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}