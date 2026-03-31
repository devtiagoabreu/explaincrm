// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin-only routes
    const adminRoutes = ["/configuracoes"]
    
    if (adminRoutes.some(route => path.startsWith(route))) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/",
    "/tarefas/:path*",
    "/empresas/:path*",
    "/pessoas/:path*",
    "/negocios/:path*",
    "/relatorios/:path*",
    "/configuracoes/:path*",
  ],
}