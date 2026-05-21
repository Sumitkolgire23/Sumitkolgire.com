"use client";

import { useEffect, useRef } from "react";

/** Dark custom cursor and reading-progress bar — mounted once globally. */
export function DarkPageEffects() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const bar = barRef.current;
    if (!cursor || !bar) return;

    // Don't run cursor animation for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0, my = 0, cx = 0, cy = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    document.addEventListener("mousemove", onMove);
    // Signal CSS that cursor JS is active — enables cursor:none safely
    document.body.classList.add("cursor-ready");

    // Grow on interactive elements
    const grow = () => cursor.classList.add("grow");
    const shrink = () => cursor.classList.remove("grow");
    const selectors = "a, button, .diary-row, .proj-card, .idea-card, .entry-card, .featured-card";
    const attachListeners = () => {
      document.querySelectorAll(selectors).forEach(el => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };
    attachListeners();

    // Reading progress bar
    const onScroll = () => {
      const t = document.body.scrollHeight - window.innerHeight;
      if (t > 0) bar.style.width = Math.min(window.scrollY / t * 100, 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Scroll-reveal via IntersectionObserver
    const ro = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      }),
      { threshold: 0.07, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div ref={barRef} className="reading-bar" aria-hidden="true" />
    </>
  );
}
