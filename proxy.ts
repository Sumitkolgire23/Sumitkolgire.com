import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/* All routes requiring an active Supabase session */
const PROTECTED_PREFIXES = ["/lab"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Pass public routes straight through — no session overhead */
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  /* updateSession refreshes the cookie and enforces auth guard.
   * If the user has no session, updateSession redirects to /login.
   * We pass the current path as ?next= so the login action can redirect
   * back to where the user was trying to go. */
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image  (Next.js internals)
     * - favicon.ico, sitemap.xml, robots.txt  (static assets)
     * - /login  (must be publicly accessible — never guard the login page itself)
     * - /studio  (Sanity Studio)
     * - Common image/font file extensions
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|login|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
