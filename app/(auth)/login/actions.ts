"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimits, checkRateLimit } from "@/lib/rate-limit";
import { hashIP } from "@/lib/hash";

export async function loginAction(
  prevState: { error: string } | undefined,
  formData: FormData
) {
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Rate limit: 5 attempts per 15 minutes per IP — brute-force protection
  try {
    const { headers } = await import("next/headers");
    const reqHeaders = await headers();
    const forwarded = reqHeaders.get("x-forwarded-for");
    const realIp    = reqHeaders.get("x-real-ip");
    const ip        = forwarded ? forwarded.split(",")[0].trim() : (realIp ?? "127.0.0.1");
    const ipHash    = hashIP(ip);

    const limiter = rateLimits.login();
    const { success } = await checkRateLimit(limiter, ipHash);
    if (!success) {
      return { error: "Too many login attempts. Please wait 15 minutes." };
    }
  } catch {
    // If rate limiting fails, fail open (do not block the login)
  }

  const cookieStore = await cookies();
  const supabase    = await createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect("/lab");
}
