import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const session = await auth()

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/upload", "/seller-analytics", "/settings"]

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Admin-only routes
  if (request.nextUrl.pathname.startsWith("/admin") && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
