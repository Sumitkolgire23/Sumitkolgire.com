"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeatureFlags } from "@/lib/features";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const flags = getFeatureFlags();
    
    // Register ScrollTrigger globally
    gsap.registerPlugin(ScrollTrigger);

    // Skip Lenis initialization if smoothScroll feature flag is disabled
    if (!flags.smoothScroll) {
      return;
    }

    // 2. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // 3. Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 4. Hook Lenis into GSAP ticker
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000); // Sync time measurements
    };
    
    gsap.ticker.add(updateRaf);

    // 5. Lag smoothing to prevent visual jumps under heavy animation loads
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateRaf);
    };
  }, []);

  return <>{children}</>;
}
