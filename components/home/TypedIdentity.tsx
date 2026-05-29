"use client";

import { useState, useEffect } from "react";

const IDENTITIES = [
  "AI/ML engineer.",
  "Multi-agent systems researcher.",
  "Builder of things that think.",
];

export function TypedIdentity() {
  const [text, setText] = useState("");
  const [identityIndex, setIdentityIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentIdentity = IDENTITIES[identityIndex];

    if (isWaiting) {
      // Pause at full word before deleting
      timer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    if (isDeleting) {
      if (text.length === 0) {
        setIsDeleting(false);
        setIdentityIndex((prev) => (prev + 1) % IDENTITIES.length);
      } else {
        // Fast backspacing speed
        timer = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
        }, 30);
      }
    } else {
      if (text.length === currentIdentity.length) {
        setIsWaiting(true);
      } else {
        // Human-like typing speed with random variance
        const randomSpeed = Math.floor(Math.random() * 40) + 50; // 50ms - 90ms
        timer = setTimeout(() => {
          setText((prev) => currentIdentity.slice(0, prev.length + 1));
        }, randomSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, isWaiting, identityIndex]);

  return (
    <span className="inline-flex items-center">
      <span>{text}</span>
      <span
        className={`typewriter-cursor ${
          isWaiting ? "opacity-100" : ""
        }`}
        aria-hidden="true"
      />
    </span>
  );
}
