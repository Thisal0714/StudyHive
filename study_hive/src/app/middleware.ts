import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/signup' || path === '/contact';

  const token = request.cookies.get('token')?.value || '';
  const role = request.cookies.get('role')?.value || ''; // 👈 grab the role cookie

  // Always redirect root to login
  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Already logged in users trying to access login/signup
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Not logged in and trying to access protected path
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🔥 Role-based block
  if (!isPublicPath && (role === 'GUEST' || !role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

// Run this middleware for all non-static, non-API routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
