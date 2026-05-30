"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollMemory — restores scroll position when the user navigates back.
 * Writes position to sessionStorage on every scroll (passive listener).
 * Reads it back on mount with an instant jump (no visual reflow).
 *
 * Renders nothing — purely a side-effect component.
 */
export function ScrollMemory() {
  const path = usePathname();
  const storageKey = `scroll:${path}`;

  useEffect(() => {
    // ── Restore ────────────────────────────────────────────────────────
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      const top = parseInt(saved, 10);
      if (!Number.isNaN(top) && top > 0) {
        // Use requestAnimationFrame to ensure layout is settled first
        requestAnimationFrame(() => {
          window.scrollTo({ top, behavior: "instant" });
        });
      }
    }

    // ── Save (passive — no jank) ────────────────────────────────────
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [storageKey]);

  return null;
}
