"use client";

import { useRef, useCallback, ReactNode, HTMLAttributes } from "react";
import { gsap } from "gsap";
import { getFeatureFlags } from "@/lib/features";

interface MagneticButtonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strength?: number;
}

export function MagneticButton({ children, strength = 0.3, style, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!getFeatureFlags().scrollAnimations) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Pull toward cursor
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Snap back with elastic bounce
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: "inline-block",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
