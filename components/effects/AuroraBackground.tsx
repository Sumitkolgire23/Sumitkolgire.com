"use client";

import { getFeatureFlags } from "@/lib/features";

export function AuroraBackground() {
  // Graceful degradation: disable heavy animations under reduced-motion profiles
  if (!getFeatureFlags().scrollAnimations) return null;

  return (
    <div className="aurora-wrap" aria-hidden="true">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
    </div>
  );
}
