import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se não está autenticado e não está na página de auth ou callback, redireciona
  if (!session && req.nextUrl.pathname !== '/auth' && !req.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // Se está autenticado e está na página de auth, redireciona para home
  if (session && req.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/auth', '/auth/callback'],
};
