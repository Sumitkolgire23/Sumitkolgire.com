"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { NeuralSkeleton } from "./NeuralSkeleton";
import { NeuralSVGFallback } from "./NeuralSVGFallback";

// Lazy-load NeuralScene with SSR disabled to prevent hydration errors
const NeuralScene = dynamic(() => import("./NeuralScene"), {
  ssr: false,
  loading: () => <NeuralSkeleton />,
});

export function NeuralHero3D() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const smallScreen = window.innerWidth < 768;
      setIsMobile(coarsePointer || smallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Display the shimmer skeleton until layout capability is detected
  if (isMobile === null) {
    return <NeuralSkeleton />;
  }

  return isMobile ? <NeuralSVGFallback /> : <NeuralScene />;
}
