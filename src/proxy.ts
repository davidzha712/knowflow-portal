import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

// Portal + Admin routes that require authentication (any locale prefix)
const isProtectedRoute = createRouteMatcher([
  "/(.*)/dashboard(.*)",
  "/(.*)/licenses(.*)",
  "/(.*)/activate(.*)",
  "/(.*)/settings(.*)",
  "/(.*)/admin(.*)",
  "/dashboard(.*)",
  "/licenses(.*)",
  "/activate(.*)",
  "/settings(.*)",
  "/admin(.*)",
])

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // API routes: run Clerk middleware only (no i18n rewriting)
  if (pathname.startsWith("/api")) {
    return clerkMiddleware()(request, {} as never)
  }

  const hostname = request.headers.get("host") ?? ""
  const isPortalSubdomain = hostname.startsWith("portal.")

  // For portal subdomain, apply Clerk auth to all routes
  if (isPortalSubdomain) {
    return clerkMiddleware(async (auth, req) => {
      const p = req.nextUrl.pathname
      if (p.includes("/sign-in") || p.includes("/sign-up")) {
        return intlMiddleware(req)
      }
      await auth.protect()
      return intlMiddleware(req)
    })(request, {} as never)
  }

  // For main domain, protect portal pages
  if (isProtectedRoute(request)) {
    return clerkMiddleware(async (auth, req) => {
      const p = req.nextUrl.pathname
      if (p.includes("/sign-in") || p.includes("/sign-up")) {
        return intlMiddleware(req)
      }
      await auth.protect()
      return intlMiddleware(req)
    })(request, {} as never)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Match all routes including API (needed for Clerk auth context)
    "/((?!_next|_vercel|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
