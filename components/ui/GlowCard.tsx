"use client";

import { useRef, useCallback, ReactNode, HTMLAttributes } from "react";
import { getFeatureFlags } from "@/lib/features";

interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlowCard({ children, className = "", style, ...props }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!getFeatureFlags().scrollAnimations) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--glow-x", `${x}%`);
    card.style.setProperty("--glow-y", `${y}%`);
  }, []);

  return (
    <div
      ref={ref}
      className={`glow-card ${className}`}
      onMouseMove={onMove}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
