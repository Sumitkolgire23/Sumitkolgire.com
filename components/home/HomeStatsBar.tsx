"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getFeatureFlags } from "@/lib/features";

export function HomeStatsBar({ streak }: { streak: number }) {
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = countRef.current;
    if (!el) return;

    // Check feature flags
    if (!getFeatureFlags().scrollAnimations) {
      el.textContent = "7";
      return;
    }

    // Set initial text
    el.textContent = "0";

    const obj = { val: 0 };
    const anim = gsap.to(obj, {
      val: 7,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = String(Math.floor(obj.val));
      },
      scrollTrigger: {
        trigger: el,
        start: "top 95%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, []);

  return (
    <>
      <div
        id="stats-bar-wrapper"
        style={{
          display: "flex",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          margin: "0 40px",
          position: "relative",
          overflow: "hidden",
        }}
        className="reveal"
      >
        <div className="dot-grid-bg" />
        {/* Active projects */}
        <div
          style={{ flex: 1, padding: "24px 28px", borderRight: "1px solid var(--border)", transition: "background .25s", cursor: "default" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <div
            ref={countRef}
            style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontStyle: "italic", color: "var(--text)", lineHeight: 1, marginBottom: "5px" }}
          >
            7
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Active projects</div>
          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: "2px" }}>Always building</div>
        </div>

        {/* Year */}
        <div
          style={{ flex: 1, padding: "24px 28px", borderRight: "1px solid var(--border)", transition: "background .25s", cursor: "default" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <div style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontStyle: "italic", color: "var(--text)", lineHeight: 1, marginBottom: "5px" }}>3rd</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Year engineering</div>
          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: "2px" }}>B.E. AI/ML · 2023–2027</div>
        </div>

        {/* Ideas */}
        <div
          style={{ flex: 1, padding: "24px 28px", borderRight: "1px solid var(--border)", transition: "background .25s", cursor: "default" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <div style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontStyle: "italic", color: "var(--text)", lineHeight: 1, marginBottom: "5px" }}>∞</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Ideas in lab</div>
          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: "2px" }}>Always planting</div>
        </div>

        {/* Streak */}
        <div
          style={{ flex: 1, padding: "24px 28px", transition: "background .25s", cursor: "default" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <div style={{ lineHeight: 1, marginBottom: "5px" }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#c41e3a" strokeWidth="1"/>
              <text fontFamily="'Instrument Serif',serif" fontSize="7" fill="#c41e3a" textAnchor="middle" x="14" y="12" fontStyle="italic">lab</text>
              <text fontFamily="'Geist Mono',monospace" fontSize="4" fill="#c41e3a" textAnchor="middle" x="14" y="20" letterSpacing=".5">active</text>
            </svg>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Lab diary</div>
          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: "2px" }}>
            {streak > 0 ? `${streak} day streak` : "Keep writing"}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #stats-bar-wrapper { margin: 0 28px !important; flex-wrap: wrap; }
          #stats-bar-wrapper > div { min-width: 50%; border-bottom: 1px solid var(--border); }
          #stats-bar-wrapper > div:nth-child(odd) { border-right: 1px solid var(--border); }
        }
        @media (max-width: 680px) {
          #stats-bar-wrapper { margin: 0 20px !important; flex-direction: column; }
          #stats-bar-wrapper > div { border-right: none !important; }
        }
      `}</style>
    </>
  );
}
