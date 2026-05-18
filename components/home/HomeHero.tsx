"use client";

import Link from "next/link";

export function HomeHero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "90vh",
        display: "grid",
        gridTemplateColumns: "1fr 440px",
        padding: "100px 40px 60px",
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
          className="reveal"
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
            AI · ML · System Design · Pune, India
          </span>
        </div>

        {/* Headline */}
        <h1
          className="reveal"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(2.5rem, 4.8vw, 4.6rem)",
            lineHeight: 1.06,
            letterSpacing: "-.02em",
            color: "var(--text)",
            fontWeight: 400,
            marginBottom: "16px",
          }}
        >
          Building
          <br />
          <em style={{ fontStyle: "italic", color: "var(--seal)" }}>intelligent</em>
          <br />
          systems
        </h1>

        <div
          className="reveal"
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            color: "var(--text3)",
            letterSpacing: ".2em",
            marginBottom: "22px",
          }}
        >
          learn · build · document
        </div>

        <p
          className="reveal"
          style={{
            fontSize: "15px",
            color: "var(--text2)",
            lineHeight: 1.88,
            maxWidth: "520px",
            marginBottom: "44px",
          }}
        >
          I&apos;m Sumit Kolgire — a third-year AI/ML engineering student from Pune.
          I write about multi-agent architectures, raw experiment failures,
          and the future of intelligence. No trend-chasing.
          Deep work, documented honestly.
        </p>

        <div
          className="reveal"
          style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}
        >
          <Link
            href="/articles"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              color: "white",
              background: "var(--seal)",
              padding: "11px 26px",
              textDecoration: "none",
              letterSpacing: ".08em",
              transition: "all .25s",
              display: "inline-block",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#a01830";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--seal)";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
          >
            Read the writing
          </Link>
          <Link
            href="/projects"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              color: "var(--text3)",
              padding: "10px 26px",
              border: "1px solid var(--border3)",
              textDecoration: "none",
              letterSpacing: ".08em",
              transition: "all .25s",
              display: "inline-block",
              background: "transparent",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--text3)";
              (e.currentTarget as HTMLElement).style.color = "var(--text)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border3)";
              (e.currentTarget as HTMLElement).style.color = "var(--text3)";
            }}
          >
            View projects
          </Link>
        </div>
      </div>

      {/* ── RIGHT — Featured Card ──────────────────────── */}
      <div style={{ position: "relative", zIndex: 2 }} className="reveal">
        <div
          className="featured-card"
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            padding: "28px",
            position: "relative",
            transition: "transform .4s ease, border-color .3s",
            cursor: "pointer",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translate(-3px,-3px)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
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
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <circle cx="21" cy="21" r="20" stroke="#c41e3a" strokeWidth="1.2"/>
              <circle cx="21" cy="21" r="16" stroke="#c41e3a" strokeWidth=".5"/>
              <text fontFamily="'Instrument Serif',serif" fontSize="9" fill="#c41e3a" textAnchor="middle" x="21" y="17" fontStyle="italic">POV</text>
              <text fontFamily="'Geist Mono',monospace" fontSize="5" fill="#c41e3a" textAnchor="middle" x="21" y="27" letterSpacing="1">FEAT.</text>
            </svg>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
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
        </div>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 1100px) {
          #hero { grid-template-columns: 1fr !important; padding: 100px 28px 60px !important; gap: 44px !important; min-height: auto !important; }
        }
        @media (max-width: 680px) {
          #hero { padding: 88px 20px 48px !important; }
        }
      `}</style>
    </section>
  );
}
