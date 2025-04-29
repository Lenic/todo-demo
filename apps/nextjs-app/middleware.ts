import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { auth } from '@/auth';

export async function middleware(req: NextRequest) {
  const session = await auth();
  if (!session) {
    const url = new URL('/api/auth/signin', req.url);
    url.searchParams.set('callbackUrl', '/todo');

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|theme.js).*)'],
};
