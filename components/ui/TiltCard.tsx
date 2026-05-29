"use client";

import { useRef, useCallback, ReactNode, HTMLAttributes } from "react";
import { getFeatureFlags } from "@/lib/features";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxTilt?: number;
}

export function TiltCard({ children, maxTilt = 8, className = "", style, ...props }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!getFeatureFlags().scrollAnimations) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const card = ref.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transition = "none";
      card.style.transform = `
        perspective(1000px)
        rotateY(${x * maxTilt}deg)
        rotateX(${-y * maxTilt}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    },
    [maxTilt]
  );

  const onLeave = useCallback(() => {
    const card = ref.current;
    if (!card) return;

    card.style.transition = "transform 0.4s ease";
    card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
