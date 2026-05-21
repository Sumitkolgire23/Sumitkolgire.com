import { createHash } from "crypto";

// In production this MUST be set — a missing salt makes IP hashes reversible.
// Throws at startup so the misconfiguration is caught immediately, not silently.
const SALT = process.env.IP_HASH_SALT;
if (!SALT && process.env.NODE_ENV === "production") {
  throw new Error(
    "FATAL: IP_HASH_SALT environment variable is required in production. " +
    "Generate with: openssl rand -hex 32"
  );
}
const EFFECTIVE_SALT = SALT ?? "dev-only-non-secret-salt";

/**
 * hashIP — SHA-256 hash of IP + salt
 * 
 * Never store raw IPs. Use this for reactions and rate limiting.
 * Result is a 64-char hex string, GDPR-safe.
 */
export function hashIP(ip: string): string {
  return createHash("sha256")
    .update(ip + EFFECTIVE_SALT)
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
