"use client";

import { useEffect, useRef } from "react";

/** Dark custom cursor, reading-progress bar, and canvas ink trail — mounted once globally. */
export function DarkPageEffects() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    const bar = barRef.current;
    if (!cursor || !bar) return;

    // Don't run custom cursor/animations for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0, my = 0, cx = 0, cy = 0;
    let animId: number;
    
    // Canvas points history for the ink trail
    const points: { x: number; y: number; t: number; w: number }[] = [];
    let lastX = 0, lastY = 0, lastTime = Date.now();

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Add points to canvas trail if not on mobile/touch devices
      if (canvas && !window.matchMedia("(pointer: coarse)").matches) {
        const now = Date.now();
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        const elapsed = Math.max(1, now - lastTime);
        const speed = dist / elapsed; // speed in px/ms

        // Brush pressure effect: slower speed = thicker lines
        const targetWidth = Math.max(1.5, Math.min(5.5, 5.5 - speed * 1.2));

        points.push({
          x: e.clientX,
          y: e.clientY,
          t: now,
          w: targetWidth,
        });

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;

        // Keep maximum points size limited for performance
        if (points.length > 25) points.shift();
      }
    };

    // Canvas rendering context & DPR scaler
    let ctx: CanvasRenderingContext2D | null = null;
    let dpr = 1;

    const resize = () => {
      if (!canvas) return;
      ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    if (canvas && !window.matchMedia("(pointer: coarse)").matches) {
      resize();
      window.addEventListener("resize", resize);
    }

    const loop = () => {
      // 1. Smooth dot cursor interpolation
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";

      // 2. Draw canvas ink trail
      if (canvas && ctx && !window.matchMedia("(pointer: coarse)").matches) {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        const now = Date.now();

        // Expire points older than 600ms
        while (points.length && now - points[0].t > 600) {
          points.shift();
        }

        if (points.length > 1) {
          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            const age = (now - p2.t) / 600; // 0 (new) to 1 (expired)
            const alpha = 0.45 * (1 - age);

            if (alpha <= 0) continue;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);

            // Connect coordinates via midpoints using quadratic curves for smooth brush stroke segments
            const xc = (p1.x + p2.x) / 2;
            const yc = (p1.y + p2.y) / 2;
            ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

            ctx.strokeStyle = `rgba(196, 30, 58, ${alpha})`; // var(--seal) hex = #c41e3a (rgb 196, 30, 58)
            ctx.lineWidth = p2.w * (1 - age * 0.5); // shrink line width as it fades
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    document.addEventListener("mousemove", onMove);
    // Signal CSS that custom cursor JS is ready
    document.body.classList.add("cursor-ready");

    // Grow cursor on interactive elements
    const grow = () => cursor.classList.add("grow");
    const shrink = () => cursor.classList.remove("grow");
    const selectors = "a, button, .diary-row, .proj-card, .idea-card, .entry-card, .featured-card";
    const attachListeners = () => {
      document.querySelectorAll(selectors).forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };
    attachListeners();

    // Reading progress bar scroll listener
    const onScroll = () => {
      const t = document.body.scrollHeight - window.innerHeight;
      if (t > 0) {
        bar.style.width = Math.min((window.scrollY / t) * 100, 100) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Scroll-reveal via IntersectionObserver
    const ro = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            ro.unobserve(e.target);
          }
        }),
      { threshold: 0.07, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => ro.observe(el));

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="ink-canvas"
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9996,
          willChange: "transform",
        }}
      />
      <div ref={barRef} className="reading-bar" aria-hidden="true" />
    </>
  );
}
