"use client";

import Link from "next/link";

type Project = {
  slug: string;
  title: string;
  excerpt?: string;
  projectStatus?: string;
  stack: string[];
};

const STATUS_LABELS: Record<string, string> = {
  active:       "Active · In progress",
  experimental: "Experimental",
  completed:    "Completed",
  archived:     "Archived",
};

export function HomeProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const [tall, ...rest] = projects;

  return (
    <section id="projects" className="page-section" style={{ background: "var(--bg)", position: "relative" }}>
      <div aria-hidden="true" style={{ position: "absolute", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "200px", color: "rgba(255,255,255,.015)", pointerEvents: "none", userSelect: "none", right: "28px", top: "32px", lineHeight: 1 }}>P</div>

      <div className="section-container">
        {/* Header */}
        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "44px", paddingBottom: "14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontStyle: "italic", color: "rgba(255,255,255,.04)", lineHeight: 1 }}>03</span>
            <div>
              <span className="section-title" style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text)" }}>Projects</span>
              <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginTop: "3px", letterSpacing: ".1em", textTransform: "uppercase" }}>Active builds · Living lab</span>
            </div>
          </div>
          <Link href="/projects" style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--seal)", textDecoration: "none", letterSpacing: ".07em" }}>All projects →</Link>
        </div>

        {/* Projects grid: 2fr 1fr 1fr with tall card spanning 2 rows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: "12px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Tall featured project */}
          <Link
            href={`/projects/${tall.slug}`}
            className="reveal"
            style={{
              gridRow: "span 2",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              padding: "24px",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              transition: "all .3s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border3)";
              (e.currentTarget as HTMLElement).style.background = "var(--bg3)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.background = "var(--bg2)";
            }}
          >
            {/* Bottom bar accent on hover */}
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "2px", background: "var(--seal)", transform: "scaleX(0)", transformOrigin: "left", transition: "transform .35s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scaleX(1)")} />

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--moss)", letterSpacing: ".07em", marginBottom: "16px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--moss)", animation: "pulse 2.5s ease-in-out infinite", flexShrink: 0, display: "inline-block" }} />
              {STATUS_LABELS[tall.projectStatus ?? "active"] ?? "Active"}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text4)", marginBottom: "10px", letterSpacing: ".15em" }}>
              [SK-001]
            </div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontStyle: "italic", color: "var(--text)", marginBottom: "8px", lineHeight: 1.28, fontWeight: 400 }}>{tall.title}</h3>
            <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7, flex: 1, marginBottom: "16px" }}>{tall.excerpt}</p>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
              {tall.stack.slice(0, 4).map(t => (
                <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", padding: "2px 7px", border: "1px solid var(--border)", letterSpacing: ".04em" }}>{t}</span>
              ))}
            </div>
          </Link>

          {/* Remaining projects */}
          {rest.slice(0, 4).map((proj, i) => (
            <Link
              key={proj.slug}
              href={`/projects/${proj.slug}`}
              className={`reveal rd${(i % 2) + 1}`}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                padding: "24px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                transition: "all .3s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border3)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg2)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--moss)", letterSpacing: ".07em", marginBottom: "16px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--moss)", animation: "pulse 2.5s ease-in-out infinite", flexShrink: 0, display: "inline-block" }} />
                {STATUS_LABELS[proj.projectStatus ?? "active"] ?? "Active"}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text4)", marginBottom: "10px", letterSpacing: ".15em" }}>
                [SK-00{i + 2}]
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", fontStyle: "italic", color: "var(--text)", marginBottom: "8px", lineHeight: 1.28, fontWeight: 400 }}>{proj.title}</h3>
              <p style={{ fontSize: "12.5px", color: "var(--text3)", lineHeight: 1.7, flex: 1, marginBottom: "16px" }}>{proj.excerpt}</p>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                {proj.stack.slice(0, 2).map(t => (
                  <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", padding: "2px 7px", border: "1px solid var(--border)", letterSpacing: ".04em" }}>{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #projects .proj-grid { grid-template-columns: 1fr 1fr !important; }
          #projects .proj-tall { grid-row: span 1 !important; }
        }
        @media (max-width: 680px) {
          #projects .proj-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
