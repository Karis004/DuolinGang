import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 需要保护的路由，必须登录才能访问
const protectedRoutes = ['/study', '/import', '/flashcard'];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // 检查当前路径是否需要保护
  const isProtectedRoute = protectedRoutes.some((route) => 
    path.startsWith(route)
  );
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // 获取 token 判断用户是否已登录
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production" 
  });
  
  if (!token) {
    // 如果未登录且尝试访问受保护路由，重定向到登录页
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
};