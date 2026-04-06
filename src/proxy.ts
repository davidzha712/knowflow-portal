import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

// Portal routes that require authentication (any locale prefix)
const isProtectedRoute = createRouteMatcher([
  "/(.*)/dashboard(.*)",
  "/(.*)/licenses(.*)",
  "/(.*)/activate(.*)",
  "/(.*)/settings(.*)",
  "/dashboard(.*)",
  "/licenses(.*)",
  "/activate(.*)",
  "/settings(.*)",
])

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? ""
  const isPortalSubdomain = hostname.startsWith("portal.")

  // For portal subdomain, apply Clerk auth to all routes
  if (isPortalSubdomain) {
    return clerkMiddleware(async (auth, req) => {
      const pathname = req.nextUrl.pathname
      // Allow sign-in/sign-up
      if (pathname.includes("/sign-in") || pathname.includes("/sign-up")) {
        return intlMiddleware(req)
      }
      await auth.protect()
      return intlMiddleware(req)
    })(request, {} as never)
  }

  // For main domain, protect only portal pages (dashboard, licenses, etc.)
  const response = intlMiddleware(request)

  if (isProtectedRoute(request)) {
    return clerkMiddleware(async (auth, req) => {
      const pathname = req.nextUrl.pathname
      if (pathname.includes("/sign-in") || pathname.includes("/sign-up")) {
        return intlMiddleware(req)
      }
      await auth.protect()
      return intlMiddleware(req)
    })(request, {} as never)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
