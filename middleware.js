import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionEdge } from '@/lib/session-edge';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    const session = await verifySessionEdge(token);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const session = await verifySessionEdge(token);
    if (!session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
