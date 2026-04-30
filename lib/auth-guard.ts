import { auth } from "@/lib/auth";

/**
 * requireOwner — reusable guard for API routes
 * 
 * Throws a 401 Response if the request has no valid session with OWNER role.
 * Usage: const session = await requireOwner(); // throws if not authorized
 */
export async function requireOwner() {
  const session = await auth();

  if (!session?.user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "OWNER") {
    throw new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return session;
}
