"use client";

import Link from "next/link";

type DiaryEntry = {
  id: string;
  mood: string | null;
  content: string;
  written_at: string;
  word_count: number;
};

function formatDiaryDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-IN", { day: "numeric" }),
    mon: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
  };
}

export function HomeDiary({
  entries,
  streak,
  heatmapLevels,
}: {
  entries: DiaryEntry[];
  streak: number;
  heatmapLevels: number[];
}) {
  return (
    <section
      id="diary"
      className="page-section"
      style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "relative" }}
    >
      <div aria-hidden="true" style={{ position: "absolute", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "200px", color: "rgba(255,255,255,.015)", pointerEvents: "none", userSelect: "none", right: "28px", top: "32px", lineHeight: 1 }}>L</div>

      <div className="section-container">
        {/* Header */}
        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "44px", paddingBottom: "14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontStyle: "italic", color: "rgba(255,255,255,.04)", lineHeight: 1 }}>02</span>
            <div>
              <span className="section-title" style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text)" }}>From the Lab Diary</span>
              <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginTop: "3px", letterSpacing: ".1em", textTransform: "uppercase" }}>Private entries · Made public</span>
            </div>
          </div>
          <Link href="/lab" style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--seal)", textDecoration: "none", letterSpacing: ".07em" }}>
            Enter the lab →
          </Link>
        </div>

        {/* Two-column: diary list + heatmap/streak */}
        <div className="diary-inner" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "60px", alignItems: "start" }}>
          {/* Left: intro + diary rows */}
          <div>
            <p className="reveal" style={{ fontSize: "15px", color: "var(--text2)", lineHeight: 1.88, marginBottom: "28px", fontStyle: "italic" }}>
              Not everything belongs in a polished article. The lab is where the real
              thinking happens — daily experiment notes, failures, breakthroughs.
              Some entries stay private. Some become essays. These are the ones that made it out.
            </p>

            {entries.length === 0 ? (
              <div style={{ border: "1px solid var(--border)", background: "var(--bg)", padding: "28px" }}>
                <p style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text3)" }}>No public diary entries yet.</p>
              </div>
            ) : (
              <div className="reveal" style={{ border: "1px solid var(--border)", overflow: "hidden", background: "var(--bg)" }}>
                {entries.map((entry, i) => {
                  const { day, mon } = formatDiaryDate(entry.written_at);
                  // Show first ~140 chars of content as preview
                  const preview = entry.content.length > 140 ? entry.content.slice(0, 140) + "…" : entry.content;
                  return (
                    <Link
                      key={entry.id}
                      href={`/lab#entry-${entry.id}`}
                      className="diary-row"
                      aria-label={`Diary entry from ${day} ${mon}: ${preview}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "52px 1fr",
                        gap: "14px",
                        padding: "16px 20px",
                        borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none",
                        cursor: "pointer",
                        transition: "background .2s",
                        alignItems: "start",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
                    >
                      {/* Date column */}
                      <div>
                        <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontStyle: "italic", color: "var(--text2)", lineHeight: 1, textAlign: "center" }}>{day}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: "8px", color: "var(--text3)", letterSpacing: ".1em", textTransform: "uppercase", textAlign: "center" }}>{mon}</div>
                      </div>
                      {/* Content column */}
                      <div>
                        {entry.mood && (
                          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--seal)", marginBottom: "5px", letterSpacing: ".07em", fontWeight: 500 }}>
                            {entry.mood}
                          </div>
                        )}
                        <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.65, fontStyle: "italic" }}>
                          {preview}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: heatmap + streak */}
          <div className="reveal rd1">
            <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "10px" }}>
              Writing streak · 2025
            </div>

            {/* Heatmap grid — 26 cols × rows = up to 182 cells but we use heatmapLevels.length */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(26, 1fr)", gap: "2px", marginBottom: "8px" }}>
              {heatmapLevels.map((level, i) => {
                const colors = ["var(--border)", "rgba(61,139,58,.22)", "rgba(61,139,58,.45)", "rgba(196,30,58,.3)", "rgba(196,30,58,.65)"];
                return (
                  <div
                    key={i}
                    title={`Day ${i + 1} · level ${level}`}
                    style={{ width: "100%", aspectRatio: "1", borderRadius: "1px", background: colors[level] ?? colors[0], cursor: "pointer", transition: "transform .15s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.4)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "")}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--mono)", fontSize: "8px", color: "var(--text3)", marginBottom: "18px" }}>
              <span>Few</span>
              {[0,1,2,3,4].map(l => {
                const colors = ["var(--border)", "rgba(61,139,58,.22)", "rgba(61,139,58,.45)", "rgba(196,30,58,.3)", "rgba(196,30,58,.65)"];
                return <div key={l} style={{ width: "9px", height: "9px", borderRadius: "1px", background: colors[l] }} />;
              })}
              <span>Many</span>
            </div>

            {/* Streak box */}
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "18px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "3rem", fontStyle: "italic", color: "var(--seal)", lineHeight: 1 }}>
                {streak || "—"}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginTop: "4px", letterSpacing: ".1em", textTransform: "uppercase" }}>
                day streak
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #diary .diary-inner { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}
