import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Better-auth sets this cookie name (prefixed with __Secure- on HTTPS in production)
const SESSION_COOKIE = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
]

const hasSessionCookie = (req: NextRequest) =>
  SESSION_COOKIE.some((name) => req.cookies.has(name))

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/dashboard")
  const isLoginPath = pathname === "/login"
  const hasSession  = hasSessionCookie(request)

  // Unauthenticated user trying to reach admin — redirect before the page renders
  if (isAdminPath && !hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Already authenticated user opening the login page — send straight to dashboard
  if (isLoginPath && hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on admin/dashboard routes and the login page only; skip static assets and API
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
}
