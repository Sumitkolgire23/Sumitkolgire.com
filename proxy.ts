import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/* All routes requiring an active Supabase session */
const PROTECTED_PREFIXES = ["/lab"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Pass public routes straight through — no session overhead */
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  /* updateSession refreshes the cookie and enforces auth guard */
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image  (Next.js internals)
     * - favicon.ico, sitemap.xml, robots.txt  (static assets)
     * - /login  (must be publicly accessible)
     * - /studio  (Sanity Studio)
     * - Image extensions
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|login|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
