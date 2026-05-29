/**
 * Simple environment-based and storage-based feature flags / kill switches.
 * Designed to disable heavy animations, 3D scenes, or AI-powered calls instantly.
 */

export interface FeatureFlags {
  smoothScroll: boolean;
  cursorTrail: boolean;
  threeHero: boolean;
  typewriter: boolean;
  scrollAnimations: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  smoothScroll: true,
  cursorTrail: true,
  threeHero: true,
  typewriter: true,
  scrollAnimations: true,
};

export function getFeatureFlags(): FeatureFlags {
  // Safe default for SSR/server-side building
  if (typeof window === "undefined") {
    return DEFAULT_FLAGS;
  }

  return {
    smoothScroll: getFlag("smoothScroll", DEFAULT_FLAGS.smoothScroll),
    cursorTrail: getFlag("cursorTrail", DEFAULT_FLAGS.cursorTrail),
    threeHero: getFlag("threeHero", DEFAULT_FLAGS.threeHero),
    typewriter: getFlag("typewriter", DEFAULT_FLAGS.typewriter),
    scrollAnimations: getFlag("scrollAnimations", DEFAULT_FLAGS.scrollAnimations),
  };
}

let reducedMotionQuery: MediaQueryList | null = null;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (!reducedMotionQuery) {
    reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  }
  return reducedMotionQuery.matches;
}

function getFlag(key: keyof FeatureFlags, defaultValue: boolean): boolean {
  try {
    // 1. Check environment variables
    const envKey = `NEXT_PUBLIC_FEATURE_${key.toUpperCase()}`;
    const envVal = process.env[envKey];
    if (envVal === "false") return false;
    if (envVal === "true") return true;

    // 2. Check localStorage overrides (e.g. for developer debug testing)
    const localVal = window.localStorage.getItem(`feature_${key}`);
    if (localVal === "false") return false;
    if (localVal === "true") return true;

    // 3. Fallback to prefers-reduced-motion check for visual animations
    if (key !== "smoothScroll" && prefersReducedMotion()) {
      return false;
    }
  } catch (e) {
    // Fail-safe: return default if access is blocked or throws
  }

  return defaultValue;
}

