import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const USER_KEY = 'clientId';

export async function middleware() {
  const store = await cookies();

  if (!store.has(USER_KEY)) {
    store.set(USER_KEY, nanoid(), { path: '/' });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|images|fonts|favicon.ico).*)'],
};
