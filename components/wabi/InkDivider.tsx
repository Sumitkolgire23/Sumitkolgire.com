"use client";

import { useEffect, useRef, useState } from "react";

export function InkDivider({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    // Instantly draw for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDrawn(true);
      return;
    }

    const svg = svgRef.current;
    if (!svg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsDrawn(true);
          observer.unobserve(svg);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 8"
      fill="none"
      className={`brush-stroke-divider ${isDrawn ? "drawn" : ""} ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 4 C 120 2, 280 6, 400 3.5 S 680 5.5, 800 4"
        stroke="var(--border2)"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="brush-path"
      />
    </svg>
  );
}
