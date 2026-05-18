"use server";

import { createClient } from "@/utils/supabase/server";
import { hashIP, getClientIP } from "@/lib/hash";

export async function addReaction(postSlug: string, type: 'like' | 'idea' | 'fire') {
  try {
    const supabase = await createClient();
    
    // Not importing headers dynamically because getClientIP takes Request in lib/hash?
    // Wait, next/headers handles it.
    // I need to redefine getClientIP to use next/headers if needed.
    // Let's just do it here to be safe.
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
