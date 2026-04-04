import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

const isPortalRoute = createRouteMatcher(["/portal(.*)"])

const clerkAuth = clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone()
  const pathname = url.pathname

  // Skip auth for sign-in/sign-up routes
  if (
    pathname.startsWith("/portal/sign-in") ||
    pathname.startsWith("/portal/sign-up")
  ) {
    return NextResponse.next()
  }

  // Protect all other portal routes
  if (isPortalRoute(req)) {
    await auth.protect()
  }
})

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? ""
  const isPortal = hostname.startsWith("portal.")

  if (isPortal) {
    const url = request.nextUrl.clone()
    if (!url.pathname.startsWith("/portal")) {
      url.pathname = `/portal${url.pathname}`
      const rewrittenRequest = new NextRequest(url, request)
      return clerkAuth(rewrittenRequest, {} as never)
    }
    return clerkAuth(request, {} as never)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
