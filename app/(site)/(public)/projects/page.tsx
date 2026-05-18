import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/velite";

export const metadata: Metadata = {
  title: "Projects — Sumit Kolgire",
  description:
    "Case studies of the things I've built — architecture decisions, trade-offs, and lessons learned.",
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  active:       { label: "ACTIVE",        color: "#4ade80" },
  experimental: { label: "EXPERIMENTAL",  color: "#facc15" },
  paused:       { label: "PAUSED",        color: "#fb923c" },
  completed:    { label: "COMPLETED",     color: "#38bdf8" },
};

function StatusPill({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status.toUpperCase(), color: "var(--text3)" };
  return (
    <span
      style={{
        fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: ".1em",
        color: meta.color,
        border: `1px solid ${meta.color}`,
        padding: "2px 8px", opacity: 0.9,
      }}
    >
      {meta.label}
    </span>
  );
}

export default function ProjectsPage() {
  const projects = getProjects();
  const active       = projects.filter(p => p.projectStatus === "active");
  const experimental = projects.filter(p => p.projectStatus === "experimental");
  const rest         = projects.filter(p => !["active", "experimental"].includes(p.projectStatus));

  const featured = [...active, ...experimental].slice(0, 2);
  const grid     = [...active, ...experimental, ...rest].slice(featured.length);

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "80px 40px 60px",
        }}
      >
        <div style={{ maxWidth: "var(--section-width)", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)",
              letterSpacing: ".2em", textTransform: "uppercase",
              marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px",
            }}
          >
            <span style={{ display: "inline-block", width: "16px", height: "1px", background: "var(--seal)" }} />
            Projects
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)", fontSize: "clamp(2rem, 4vw, 3rem)",
              fontStyle: "italic", fontWeight: 400, color: "var(--text)",
              lineHeight: 1.1, marginBottom: "16px",
            }}
          >
            Things I&apos;ve Built
          </h1>
          <p
            style={{
              fontSize: "15px", color: "var(--text2)", lineHeight: 1.75,
              maxWidth: "50ch", fontStyle: "italic",
            }}
          >
            Not a list of GitHub repos. Case studies — what I was thinking, what broke, and what I learned.
          </p>
        </div>
      </section>

      {/* ── FEATURED (active + experimental) ────────────────────── */}
      {featured.length > 0 && (
        <section
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "60px 40px",
          }}
        >
          <div style={{ maxWidth: "var(--section-width)", margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)",
                letterSpacing: ".14em", textTransform: "uppercase",
                marginBottom: "32px",
              }}
            >
              Featured
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: featured.length > 1 ? "1fr 1fr" : "1fr",
                gap: "1px",
                border: "1px solid var(--border)",
                background: "var(--border)",
              }}
            >
              {featured.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug.split("/").pop()}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "var(--bg)",
                      padding: "36px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "background .2s",
                    }}
                    className="proj-card-dark"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                      <StatusPill status={project.projectStatus} />
                      <span
                        style={{
                          fontFamily: "var(--mono)", fontSize: "9px",
                          color: "var(--text4)", letterSpacing: ".06em",
                        }}
                      >
                        {new Date(project.date).getFullYear()}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: "var(--serif)", fontSize: "1.6rem",
                        fontStyle: "italic", fontWeight: 400,
                        color: "var(--text)", lineHeight: 1.2, marginBottom: "12px",
                      }}
                    >
                      {project.title}
                    </h2>

                    <p
                      style={{
                        fontSize: "14px", color: "var(--text2)", lineHeight: 1.72,
                        flex: 1, marginBottom: "24px",
                      }}
                    >
                      {project.excerpt}
                    </p>

                    {project.stack && project.stack.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                        {project.stack.slice(0, 5).map((tech: string) => (
                          <span
                            key={tech}
                            style={{
                              fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: ".06em",
                              color: "var(--text3)", border: "1px solid var(--border)",
                              padding: "2px 8px",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── REST OF PROJECTS ─────────────────────────────────────── */}
      {grid.length > 0 && (
        <section style={{ padding: "60px 40px" }}>
          <div style={{ maxWidth: "var(--section-width)", margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)",
                letterSpacing: ".14em", textTransform: "uppercase",
                marginBottom: "32px",
              }}
            >
              All Projects
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {grid.map((project, i, arr) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug.split("/").pop()}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 1fr auto",
                      gap: "32px", alignItems: "center",
                      padding: "20px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                      transition: "background .2s",
                    }}
                    className="proj-row-dark"
                  >
                    <h3
                      style={{
                        fontFamily: "var(--serif)", fontSize: "1rem",
                        fontStyle: "italic", fontWeight: 400, color: "var(--text)",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
                      {project.excerpt}
                    </p>
                    <StatusPill status={project.projectStatus} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EMPTY STATE ──────────────────────────────────────────── */}
      {projects.length === 0 && (
        <section style={{ padding: "80px 40px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--mono)", fontSize: "13px",
              color: "var(--text3)", letterSpacing: ".06em",
            }}
          >
            Case studies loading — content pipeline warming up.
          </p>
        </section>
      )}

      {/* Hover styles */}
      <style>{`
        .proj-card-dark:hover { background: var(--bg2) !important; }
        .proj-row-dark:hover  { background: var(--bg2); padding-left: 12px; }
      `}</style>
    </main>
  );
}
