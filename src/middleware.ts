import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const protectedPaths = ['/profile', '/Xprofile'];
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Tokenni tekshirish uchun API so‘rovi
    try {
      const response = await fetch('https://qqrnatcraft.uz/accounts/profile/me/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // Token yaroqsiz bo‘lsa, cookie’ni o‘chirish va login ga yo‘naltirish
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        return response;
      }
    } catch (error) {
      console.error('Middleware token validation error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/Xprofile/:path*'],
};