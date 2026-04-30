import { createHash } from "crypto";

const SALT = process.env.IP_HASH_SALT ?? "fallback-salt-change-in-prod";

/**
 * hashIP — SHA-256 hash of IP + salt
 * 
 * Never store raw IPs. Use this for reactions and rate limiting.
 * Result is a 64-char hex string, GDPR-safe.
 */
export function hashIP(ip: string): string {
  return createHash("sha256")
    .update(ip + SALT)
    .digest("hex");
}

/**
 * getClientIP — extract real IP from Next.js request
 * Handles Vercel / Cloudflare proxy headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}
