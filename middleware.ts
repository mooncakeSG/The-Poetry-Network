import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { getToken } from "next-auth/jwt"

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

// List of public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/api/auth"]
const apiRoutes = ["/api"]

// Helper function to get client IP
function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for")
  return xff ? xff.split(",")[0] : "127.0.0.1"
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Get the pathname of the request
  const pathname = request.nextUrl.pathname

  // Check if the route is an API route
  const isApiRoute = apiRoutes.some((route) => pathname.startsWith(route))

  // Apply rate limiting to API routes
  if (isApiRoute) {
    const ip = getClientIp(request)
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    )
    
    if (!success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      })
    }

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", limit.toString())
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
    response.headers.set("X-RateLimit-Reset", reset.toString())
  }

  // Check authentication for protected routes
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  
  if (!isPublicRoute) {
    const token = await getToken({ req: request })
    
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Add security headers
  const headers = response.headers
  headers.set("X-DNS-Prefetch-Control", "on")
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  headers.set("X-Frame-Options", "SAMEORIGIN")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:;"
  )
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return response
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
} 