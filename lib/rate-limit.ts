import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazy-initialize Redis (skip if env vars missing in dev)
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

/**
 * Rate limit configurations per endpoint type
 */
export const rateLimits = {
  // Newsletter subscribe: 3 per hour per IP
  subscribe: () => {
    const r = getRedis();
    if (!r) return null;
    return new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "rl:subscribe",
    });
  },

  // Reactions (agree/challenge): 5 per hour per IP+slug
  reactions: () => {
    const r = getRedis();
    if (!r) return null;
    return new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "rl:reactions",
    });
  },

  // View counting: 1 per hour per IP+slug
  views: () => {
    const r = getRedis();
    if (!r) return null;
    return new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(1, "1 h"),
      prefix: "rl:views",
    });
  },

  // Login: 5 attempts per 15 minutes per IP
  login: () => {
    const r = getRedis();
    if (!r) return null;
    return new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: "rl:login",
    });
  },

  // AI endpoints: 10 per hour per session
  ai: () => {
    const r = getRedis();
    if (!r) return null;
    return new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      prefix: "rl:ai",
    });
  },
};

/**
 * checkRateLimit — returns {success, limit, reset, remaining}
 * Pass identifier as: IP, IP+slug, or session ID
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!limiter) {
    // No Redis configured — allow all (dev mode)
    return { success: true, remaining: 999, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
