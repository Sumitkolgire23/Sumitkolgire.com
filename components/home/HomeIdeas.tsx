"use client";

import Link from "next/link";

type Idea = {
  id: string;
  content: string;
  ripeness: string;
  planted_at: string;
  tags: string[];
};

const RIPENESS_CONFIG: Record<string, { symbol: string; color: string; label: string; barColor: string }> = {
  seed:      { symbol: "○", color: "var(--text3)", label: "Seed",      barColor: "var(--text4)" },
  sprout:    { symbol: "◎", color: "var(--moss)",  label: "Sprout",    barColor: "var(--moss)"  },
  ripe:      { symbol: "●", color: "var(--gold)",  label: "Ripe",      barColor: "var(--gold)"  },
  published: { symbol: "★", color: "var(--seal)",  label: "Published", barColor: "var(--seal)"  },
};

function formatPlanted(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function HomeIdeas({
  ideas,
  stats,
}: {
  ideas: Idea[];
  stats: { total: number; ripe: number };
}) {
  return (
    <section
      id="ideas"
      className="page-section"
      style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "relative" }}
    >
      <div aria-hidden="true" style={{ position: "absolute", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "200px", color: "rgba(255,255,255,.015)", pointerEvents: "none", userSelect: "none", right: "28px", top: "32px", lineHeight: 1 }}>I</div>

      <div className="section-container">
        {/* Header */}
        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "44px", paddingBottom: "14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontStyle: "italic", color: "rgba(255,255,255,.04)", lineHeight: 1 }}>04</span>
            <div>
              <span style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text)" }}>Ideas Lab</span>
              <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginTop: "3px", letterSpacing: ".1em", textTransform: "uppercase" }}>Raw ideas in progress</span>
            </div>
          </div>
          <Link href="/lab/ideas" style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--seal)", textDecoration: "none", letterSpacing: ".07em" }}>All ideas →</Link>
        </div>

        {ideas.length === 0 ? (
          <p className="reveal" style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text3)" }}>
            Ideas are being planted. Check back soon.
          </p>
        ) : (
          <>
            {/* Ideas wall — 4 columns with staggered offsets */}
            <div
              className="reveal"
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px", position: "relative", zIndex: 1 }}
            >
              {ideas.map((idea, i) => {
                const cfg = RIPENESS_CONFIG[idea.ripeness] ?? RIPENESS_CONFIG.seed;
                const offsets = [0, 14, 5, 10];
                return (
                  <div
                    key={idea.id}
                    className="idea-card"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      padding: "16px",
                      cursor: "pointer",
                      position: "relative",
                      transition: "transform .3s, box-shadow .3s, border-color .3s",
                      marginTop: `${offsets[i % 4]}px`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-3px)";
                      el.style.borderColor = "var(--border3)";
                      el.style.boxShadow = "0 8px 32px rgba(0,0,0,.4)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "";
                      el.style.borderColor = "var(--border)";
                      el.style.boxShadow = "";
                    }}
                  >
                    {/* Top accent bar */}
                    <div
                      aria-hidden="true"
                      style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: cfg.barColor, opacity: 0.85 }}
                    />

                    {/* Ripeness indicator */}
                    <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ color: cfg.color }}>{cfg.symbol}</span>
                      {cfg.label}
                    </div>

                    {/* Idea content */}
                    <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.65, marginBottom: "10px", fontStyle: "italic" }}>
                      {idea.content.length > 120 ? idea.content.slice(0, 120) + "…" : idea.content}
                    </p>

                    <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)" }}>
                      Planted {formatPlanted(idea.planted_at)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer stats + CTA */}
            <div
              className="reveal"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "18px", borderTop: "1px solid var(--border)", position: "relative", zIndex: 1 }}
            >
              <div style={{ fontSize: "13.5px", color: "var(--text3)", fontStyle: "italic" }}>
                <strong style={{ color: "var(--text)", fontFamily: "var(--serif)", fontSize: "1.4rem", fontStyle: "italic", marginRight: "4px" }}>
                  {stats.total || "∞"}
                </strong>{" "}
                ideas planted —{" "}
                <strong style={{ color: "var(--text)", fontFamily: "var(--serif)", fontSize: "1.4rem", fontStyle: "italic", marginRight: "4px" }}>
                  {stats.ripe}
                </strong>{" "}
                ripe
              </div>
              <Link
                href="/lab/ideas"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10px",
                  color: "var(--text3)",
                  padding: "8px 18px",
                  border: "1px solid var(--border3)",
                  textDecoration: "none",
                  letterSpacing: ".08em",
                  transition: "all .25s",
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
                Enter the ideas lab →
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #ideas .ideas-wall { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 680px) {
          #ideas .ideas-wall { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
