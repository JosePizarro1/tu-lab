import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas públicas que no requieren autenticación
  const isPublicRoute = 
    pathname === '/' ||
    pathname === '/api/login' ||
    pathname === '/api/reniec' ||
    pathname === '/api/seed' ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // 1. Proteger llamadas API privadas (excepto públicas)
  if (pathname.startsWith('/api/') && !isPublicRoute) {
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado. Debe iniciar sesión.' },
        { status: 401 }
      );
    }
  }

  // 2. Proteger rutas del Dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
  ],
};
