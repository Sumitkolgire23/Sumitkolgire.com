"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/**
 * requireOwner — reusable guard for Server Actions and API routes.
 *
 * Throws a Response (401/403) if the request has no valid Supabase session.
 * Usage: const user = await requireOwner();
 */
export async function requireOwner() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  /* Optional: enforce a role stored in user_metadata or app_metadata */
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined;
  if (role && role !== "OWNER") {
    throw new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return user;
}
