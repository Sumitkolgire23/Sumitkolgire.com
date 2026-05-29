"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeatureFlags } from "@/lib/features";

export function HomeObsession() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safely register ScrollTrigger inside client boundary
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const horizontal = horizontalRef.current;
    if (!section || !horizontal) return;

    if (!getFeatureFlags().scrollAnimations) return;

    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const mm = gsap.matchMedia();

    // Pinning and horizontal translation only active on desktop screens
    mm.add("(min-width: 1101px)", () => {
      const scrollWidth = horizontal.scrollWidth;
      const clientWidth = horizontal.clientWidth;
      const xTranslation = -(scrollWidth - clientWidth);

      const anim = gsap.to(horizontal, {
        x: xTranslation,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          start: "top top",
          end: () => `+=${Math.abs(xTranslation) + 120}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        anim.kill();
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="obsession"
      style={{
        background: "var(--bg2)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        padding: "100px 0",
      }}
    >
      {/* Large faint background label */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "40px",
          top: "40px",
          fontFamily: "var(--serif)",
          fontSize: "220px",
          fontStyle: "italic",
          color: "rgba(255,255,255,.012)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        S
      </div>

      <div className="section-container" style={{ width: "100%" }}>
        <div
          className="reveal obs-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "80px",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Left Column (Pinned Text Block) */}
          <div style={{ position: "relative", zIndex: 3 }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "9px",
                color: "var(--text3)",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ display: "inline-block", width: "16px", height: "1px", background: "var(--seal)" }} />
              Currently thinking about
            </div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.7rem, 3vw, 2.8rem)",
                fontStyle: "italic",
                lineHeight: 1.18,
                color: "var(--text)",
                marginBottom: "18px",
                fontWeight: 400,
              }}
            >
              The architecture of consciousness and what it means for machines that simulate it
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.8 }}>
              Not as a philosophical exercise — as an engineering constraint. If we build
              systems that model their own state, what failure modes emerge? What does a
              &quot;strange loop&quot; look like in a production agent system? These questions
              shape everything I&apos;m building right now.
            </p>
          </div>

          {/* Right Column (Horizontal Cards Carousel) */}
          <div style={{ width: "100%", overflow: "hidden", position: "relative", padding: "10px 0" }}>
            <div
              ref={horizontalRef}
              style={{
                display: "flex",
                gap: "24px",
                width: "max-content",
                willChange: "transform",
              }}
              className="obs-carousel"
            >
              {[
                {
                  label: "Reading",
                  value: "Gödel, Escher, Bach — Hofstadter",
                  detail: "Exploring strange loops, formal systems, and the isomorphism between mind and math.",
                },
                {
                  label: "Building",
                  value: "Multi-agent state serialization",
                  detail: "Implementing cross-process checkpointing for autonomous agent clusters in TypeScript.",
                },
                {
                  label: "Learning",
                  value: "Japanese — JLPT N5 prep",
                  detail: "Studying hiragana, katakana, and basic kanji structure for language grounding.",
                },
                {
                  label: "Listening",
                  value: "Lex Fridman #400 — Consciousness",
                  detail: "Analyzing theories of integrated information, computational models, and panpsychism.",
                },
              ].map(({ label, value, detail }) => (
                <div
                  key={label}
                  style={{
                    flexShrink: 0,
                    width: "320px",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "240px",
                    transition: "border-color 0.3s, background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border3)";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg3)";
                  }}
                >
                  <div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--seal)", letterSpacing: ".1em", textTransform: "uppercase" }}>
                      {label}
                    </span>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontStyle: "italic", color: "var(--text)", marginTop: "14px", marginBottom: "10px", lineHeight: 1.25, fontWeight: 400 }}>
                      {value}
                    </h3>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.7 }}>
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #obsession { min-height: auto !important; padding: 60px 0 !important; }
          .obs-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .obs-carousel {
            flex-direction: column !important;
            gap: 16px !important;
            width: 100% !important;
            transform: none !important;
          }
          .obs-carousel > div {
            width: 100% !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
