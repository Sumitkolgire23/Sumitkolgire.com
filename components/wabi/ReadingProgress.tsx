"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Calculate how far down the user has scrolled
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Calculate total scrollable distance
      const totalScrollable = docHeight - windowHeight;

      // Prevent division by zero if page is not scrollable
      if (totalScrollable <= 0) {
        setProgress(0);
        return;
      }

      // Calculate percentage
      const percent = (scrollPosition / totalScrollable) * 100;
      setProgress(Math.min(100, Math.max(0, percent)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    // Initial call to set state
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        width: `${progress}%`,
        background: "var(--seal)",
        zIndex: 9999,
        transition: "width 0.1s ease-out",
        pointerEvents: "none",
      }}
    />
  );
}
