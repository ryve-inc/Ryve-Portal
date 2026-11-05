import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/signin' || pathname === '/signup';
  const isAuthApi = pathname.startsWith('/api/auth');
  const isPublicPage = pathname === '/';
  const isApiRoute = pathname.startsWith('/api');

  // Allow auth APIs to process authentication requests
  if (isAuthApi) {
    return NextResponse.next();
  }

  // Allow root '/' page publicly without auth
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Redirect already authenticated users away from /login, /signin, /signup to /
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow auth pages for visitors
  if (isAuthPage) {
    return NextResponse.next();
  }

  // For internal API routes: allow read operations (GET) for public dashboard data,
  // require active session for write mutations (POST, PUT, DELETE)
  if (isApiRoute) {
    if (request.method === 'GET' || sessionCookie) {
      return NextResponse.next();
    }
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Active session required' },
      { status: 401 }
    );
  }

  // Redirect unauthenticated users on protected subpaths to /login
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

