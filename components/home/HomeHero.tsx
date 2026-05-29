"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { TimeAwareGreeting } from "@/components/home/TimeAwareGreeting";
import { TypedIdentity } from "@/components/home/TypedIdentity";
import { NeuralHero3D } from "@/components/home/NeuralHero3D";
import SplitType from "split-type";
import { gsap } from "gsap";
import { getFeatureFlags } from "@/lib/features";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GlowCard } from "@/components/ui/GlowCard";

export function HomeHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const section = el.closest("section");
    const overline = section?.querySelector(".reveal-overline");
    const typewriter = section?.querySelector(".reveal-typewriter");
    const paragraph = section?.querySelector(".reveal-paragraph");
    const ctas = section?.querySelector(".reveal-ctas");
    const rightCol = section?.querySelector(".reveal-right");

    if (!section || !overline || !typewriter || !paragraph || !ctas || !rightCol) return;

    // Check feature flags & prefers-reduced-motion media query
    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!getFeatureFlags().scrollAnimations || reducedMotion) {
      el.style.opacity = "1";
      gsap.set([overline, typewriter, paragraph, ctas, rightCol], { opacity: 1, y: 0 });
      return;
    }

    // Split headline by characters & words
    const split = new SplitType(el, { types: "chars,words" });
    const chars = split.chars;
    if (!chars) return;

    // Accessibility: set label on parent and hide individual characters
    el.setAttribute("aria-label", el.textContent || "");
    chars.forEach((char) => char.setAttribute("aria-hidden", "true"));

    // Set overflow hidden on words to clip sliding chars
    const words = el.querySelectorAll(".word");
    words.forEach((word) => {
      (word as HTMLElement).style.display = "inline-block";
      (word as HTMLElement).style.overflow = "hidden";
      (word as HTMLElement).style.verticalAlign = "bottom";
    });

    // Disable CSS transitions inline for text nodes to prevent lags
    gsap.set(chars, { transition: "none" });

    // Set initial displaced state
    gsap.set(chars, { y: "110%", opacity: 0 });
    gsap.set([overline, typewriter, paragraph, ctas, rightCol], { opacity: 0, y: 24, transition: "none" });

    // Separate normal characters from the emphasis word characters
    const intelligentWord = el.querySelector("em");
    const normalChars: HTMLElement[] = [];
    const intelligentChars: HTMLElement[] = [];

    chars.forEach((char) => {
      if (intelligentWord?.contains(char)) {
        intelligentChars.push(char);
      } else {
        normalChars.push(char);
      }
    });

    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Overline fades/slides up
    tl.to(overline, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    // 2. Headline characters cascade up
    tl.to(
      normalChars,
      {
        y: "0%",
        opacity: 1,
        duration: 0.7,
        stagger: 0.015,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // Stagger the intelligent word characters with custom overlay
    tl.to(
      intelligentChars,
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // 3. Typewriter identity and body paragraph reveal
    tl.to(
      [typewriter, paragraph],
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      },
      "-=0.45"
    );

    // 4. CTA buttons slide up
    tl.to(
      ctas,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // 5. Right column (3D scene + Featured Card Stack) fades and slides in
    tl.to(
      rightCol,
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.3"
    );

    return () => {
      tl.kill();
      split.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "90vh",
        display: "grid",
        gridTemplateColumns: "1fr 440px",
        padding: "40px 40px 60px",
        gap: "48px",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-200px",
          right: "-100px",
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(ellipse at center, rgba(196,30,58,.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Large faint italic "S" background mark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-60px",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--serif)",
          fontSize: "520px",
          color: "rgba(255,255,255,.018)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-.05em",
          fontStyle: "italic",
        }}
      >
        S
      </div>

      {/* ── LEFT ──────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Overline */}
        <div
          className="reveal-overline"
          style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}
        >
          <div style={{ width: "24px", height: "1px", background: "var(--seal)" }} />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              color: "var(--seal)",
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            <TimeAwareGreeting /> · AI · ML · System Design · Pune, India
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(2.5rem, 4.8vw, 4.6rem)",
            lineHeight: 1.06,
            letterSpacing: "-.02em",
            color: "var(--text)",
            fontWeight: 400,
            marginBottom: "20px",
          }}
        >
          Building
          <br />
          <em className="gradient-text" style={{ fontStyle: "italic" }}>intelligent</em>
          <br />
          systems
        </h1>

        {/* Dynamic Typewriter Identity */}
        <div
          className="reveal-typewriter"
          style={{
            fontFamily: "var(--mono)",
            fontSize: "13px",
            color: "var(--text3)",
            letterSpacing: ".05em",
            marginBottom: "24px",
            minHeight: "26px", // prevent layout shift while typing
            display: "flex",
            alignItems: "center",
          }}
        >
          I am a&nbsp;<span style={{ color: "var(--text)", fontWeight: 400 }}><TypedIdentity /></span>
        </div>

        <p
          className="reveal-paragraph"
          style={{
            fontSize: "15px",
            color: "var(--text2)",
            lineHeight: 1.88,
            maxWidth: "520px",
            marginBottom: "44px",
          }}
        >
          A third-year AI/ML engineering student from Pune.
          I write about multi-agent architectures, raw experiment failures,
          and the future of intelligence. No trend-chasing.
          Deep work, documented honestly.
        </p>

        <div
          className="reveal-ctas"
          style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}
        >
          <MagneticButton strength={0.25}>
            <Link
              href="/articles"
              className="cta-glow-scale"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                color: "white",
                background: "var(--seal)",
                padding: "11px 26px",
                textDecoration: "none",
                letterSpacing: ".08em",
                display: "inline-block",
              }}
            >
              Read the writing
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.25}>
            <Link
              href="/projects"
              className="cta-glow-scale"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                color: "var(--text3)",
                padding: "10px 26px",
                border: "1px solid var(--border3)",
                textDecoration: "none",
                letterSpacing: ".08em",
                display: "inline-block",
                background: "transparent",
              }}
            >
              View projects
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* ── RIGHT — 3D Scene and Featured Card Stack ──────────────────────── */}
      <div
        className="reveal-right"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        <NeuralHero3D />

        <GlowCard
          className="featured-card"
          style={{
            padding: "28px",
            position: "relative",
            cursor: "pointer",
          }}
        >
          {/* Offset shadow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              border: "1px solid rgba(196,30,58,.08)",
              transform: "translate(7px,7px)",
              pointerEvents: "none",
              transition: "transform .4s",
            }}
          />
          {/* Hanko stamp */}
          <div style={{ position: "absolute", top: "24px", right: "24px" }}>
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
              <circle cx="21" cy="21" r="20" stroke="#c41e3a" strokeWidth="1.2"/>
              <circle cx="21" cy="21" r="16" stroke="#c41e3a" strokeWidth=".5"/>
              <text fontFamily="'Instrument Serif',serif" fontSize="9" fill="#c41e3a" textAnchor="middle" x="21" y="17" fontStyle="italic">POV</text>
              <text fontFamily="'Geist Mono',monospace" fontSize="5" fill="#c41e3a" textAnchor="middle" x="21" y="27" letterSpacing="1">FEAT.</text>
            </svg>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".15em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "12px", height: "1px", background: "var(--text3)" }} />
              Featured perspective
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--seal)", background: "var(--seal2)", border: "1px solid rgba(196,30,58,.2)", padding: "3px 9px", borderRadius: "100px", letterSpacing: ".08em" }}>
              AI Systems
            </span>
          </div>

          <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", fontStyle: "italic", lineHeight: 1.38, color: "var(--text)", marginBottom: "14px", fontWeight: 400 }}>
            Why multi-agent systems will redefine how software gets built in the next decade
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.75, marginBottom: "22px", fontStyle: "italic", paddingLeft: "14px", borderLeft: "1px solid var(--border2)" }}>
            The real shift is not AI writing code. It is agents forming autonomous networks that architect, test, and deploy entire systems. Human oversight becomes a thin, intentional layer — not a bottleneck.
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)" }}>April 22, 2025</span>
            <Link href="/perspectives" style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--seal)", textDecoration: "none" }}>8 min read →</Link>
          </div>
        </GlowCard>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 1100px) {
          #hero { grid-template-columns: 1fr !important; padding: 40px 28px 48px !important; gap: 40px !important; min-height: auto !important; }
        }
        @media (max-width: 680px) {
          #hero { padding: 28px 20px 36px !important; }
        }
      `}</style>
    </section>
  );
}

