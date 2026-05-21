import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/** All route prefixes that require an active Supabase session */
const PROTECTED_PREFIXES = ["/lab"];

/**
 * Next.js Edge Middleware — runs before every matched request.
 *
 * 1. Refreshes the Supabase auth cookie so it never silently expires.
 * 2. Redirects unauthenticated users away from protected routes.
 *
 * NOTE: This file MUST be named `middleware.ts` at the project root
 * and export a function named `middleware` — Next.js ignores any other name.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass public routes straight through — no session overhead
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // updateSession refreshes the cookie and enforces the auth guard.
  // If the user has no session it redirects to /login.
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image  (Next.js internals)
     * - favicon.ico, sitemap.xml, robots.txt  (static assets)
     * - /login  (must stay public — never guard the login page itself)
     * - /studio  (Sanity Studio — needs its own relaxed CSP)
     * - Common image / font extensions
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|login|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
