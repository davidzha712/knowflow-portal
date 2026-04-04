import createMiddleware from "next-intl/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? ""
  const isPortal = hostname.startsWith("portal.")

  if (isPortal) {
    const url = request.nextUrl.clone()
    if (!url.pathname.startsWith("/portal")) {
      url.pathname = `/portal${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
