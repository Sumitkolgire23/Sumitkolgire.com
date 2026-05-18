"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { hashIP } from "@/lib/hash";

export async function addReaction(postSlug: string, type: 'like' | 'idea' | 'fire') {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { headers } = await import("next/headers");
    const reqHeaders = await headers();
    
    const forwarded = reqHeaders.get("x-forwarded-for");
    const realIp = reqHeaders.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : (realIp || "127.0.0.1");
    
    const ipHash = hashIP(ip);

    const { error } = await supabase.from("reactions").insert({
      post_slug: postSlug,
      type,
      ip_hash: ipHash
    });
    
    if (error) {
      console.error("Failed to add reaction:", error);
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error("Reaction error:", err);
    return { success: false };
  }
}
