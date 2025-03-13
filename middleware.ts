import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    // Protected routes that require authentication
    "/api/poems/:path*",
    "/api/comments/:path*",
    "/api/workshops/:path*",
    "/profile/:path*",
    "/workshops/:path*",
  ],
}; 