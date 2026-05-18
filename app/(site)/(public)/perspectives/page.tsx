import type { Metadata } from "next";
import Link from "next/link";
import { getPerspectives } from "@/lib/velite";

export const metadata: Metadata = {
  title: "Perspectives — Sumit Kolgire",
  description:
    "Short, opinionated stances on AI, building, and the world. Positions I'm willing to defend.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function PerspectivesPage() {
  const povs = getPerspectives();

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
            Perspectives
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)", fontSize: "clamp(2rem, 4vw, 3rem)",
              fontStyle: "italic", fontWeight: 400, color: "var(--text)",
              lineHeight: 1.1, marginBottom: "16px",
            }}
          >
            Positions &amp; POVs
          </h1>
          <p
            style={{
              fontSize: "15px", color: "var(--text2)", lineHeight: 1.75,
              maxWidth: "50ch", fontStyle: "italic",
            }}
          >
            Shorter than essays. More opinionated. A position I&apos;m willing to
            defend — and sometimes revise.
          </p>
        </div>
      </section>

      {/* ── LIST ────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 40px 80px" }}>
        <div style={{ maxWidth: "var(--section-width)", margin: "0 auto" }}>
          {povs.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--mono)", fontSize: "13px",
                  color: "var(--text3)", letterSpacing: ".06em",
                }}
              >
                No perspectives published yet. Still forming.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {povs.map((pov, i, arr) => (
                <Link
                  key={pov.slug}
                  href={`/perspectives/${pov.slug.split("/").pop()}`}
                  style={{ textDecoration: "none" }}
                >
                  <article
                    className="pov-row-dark"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr",
                      gap: "32px",
                      padding: "32px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                      transition: "all .2s",
                    }}
                  >
                    {/* Left: date */}
                    <div style={{ paddingTop: "4px" }}>
                      <time
                        style={{
                          fontFamily: "var(--mono)", fontSize: "10px",
                          color: "var(--text4)", display: "block", lineHeight: 1.5,
                        }}
                      >
                        {formatDate(pov.date)}
                      </time>
                    </div>

                    {/* Right: content */}
                    <div>
                      {/* Badges + tags */}
                      <div
                        style={{
                          display: "flex", gap: "8px", flexWrap: "wrap",
                          alignItems: "center", marginBottom: "10px",
                        }}
                      >
                        {pov.contested && (
                          <span
                            style={{
                              fontFamily: "var(--mono)", fontSize: "9px",
                              letterSpacing: ".1em", color: "var(--seal)",
                              border: "1px solid var(--seal)", padding: "1px 7px",
                            }}
                          >
                            CONTESTED
                          </span>
                        )}
                        {pov.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            style={{
                              fontFamily: "var(--mono)", fontSize: "9px",
                              letterSpacing: ".1em", color: "var(--text3)",
                              textTransform: "uppercase",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2
                        style={{
                          fontFamily: "var(--serif)", fontSize: "1.2rem",
                          fontStyle: "italic", fontWeight: 400,
                          color: "var(--text)", lineHeight: 1.3, marginBottom: "8px",
                        }}
                      >
                        {pov.title}
                      </h2>

                      {/* Stance — the core bold claim */}
                      {pov.stance && (
                        <p
                          style={{
                            fontFamily: "var(--serif)", fontStyle: "italic",
                            fontSize: "13px", color: "var(--seal)",
                            marginBottom: "10px", lineHeight: 1.55,
                          }}
                        >
                          &ldquo;{pov.stance}&rdquo;
                        </p>
                      )}

                      <p
                        style={{
                          fontSize: "14px", color: "var(--text2)",
                          lineHeight: 1.7, margin: 0,
                        }}
                      >
                        {pov.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .pov-row-dark:hover h2 { color: var(--seal) !important; }
        .pov-row-dark:hover    { background: var(--bg2); padding-left: 12px; padding-right: 12px; }
      `}</style>
    </main>
  );
}
