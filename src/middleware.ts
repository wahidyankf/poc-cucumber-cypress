import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value;

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    return response;
  }

  // If it's the login page and there's a token, redirect to dashboard
  if (path === "/login" && token) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
