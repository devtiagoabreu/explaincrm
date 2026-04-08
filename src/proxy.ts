// src/proxy.ts
import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export function proxy(req: NextRequestWithAuth) {
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
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/tarefas/:path*",
    "/empresas/:path*",
    "/pessoas/:path*",
    "/negocios/:path*",
    "/relatorios/:path*",
    "/configuracoes/:path*",
  ],
}

// Aplicar o withAuth ao proxy
export default withAuth(proxy, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})