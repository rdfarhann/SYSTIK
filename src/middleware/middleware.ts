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
          // Sinkronisasi cookie ke request asli
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Sinkronisasi cookie ke response agar tersimpan di browser
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // SANGAT PENTING: Me-refresh session agar cookie terupdate sebelum pengecekan
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isDashboardPage = url.pathname.startsWith('/dashboard')
  const isLoginPage = url.pathname === '/login' || url.pathname === '/' // Tambahkan "/" jika login ada di root
  
  const isPublicAuthRoute = 
    isLoginPage || 
    url.pathname.startsWith('/confirm-password') || 
    url.pathname.startsWith('/reset-password')

  // Logika Redirect
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!user && isDashboardPage && !isPublicAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}