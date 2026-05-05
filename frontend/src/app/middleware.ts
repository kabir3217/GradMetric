import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  // Pages that do not require authentication
  const publicPaths = ["/auth/teacher/login", "/api/auth/login"];
  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  if (!token && !isPublicPath) {
    // Redirect to login if not logged in
    return NextResponse.redirect(new URL("/auth/teacher/login", req.url));
  }

  if (token && req.nextUrl.pathname.startsWith("/auth/teacher/login")) {
    // If logged in, prevent access to login page
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/results/:path*",
    "/api/:path*",
  ],
};
