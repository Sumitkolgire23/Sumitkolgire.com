import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, getFeaturedArticles } from "@/lib/velite";
import { getProjects } from "@/lib/velite";
import { InkDivider } from "@/components/wabi/InkDivider";
import { OffsetShadowCard } from "@/components/wabi/OffsetShadowCard";
import { StatusBadge } from "@/components/wabi/StatusBadge";
import { HaikuNewsletter } from "@/components/wabi/HaikuNewsletter";

export const metadata: Metadata = {
  title: "Sumit Kolgire — AI/ML Engineer",
  description:
    "AI/ML engineer in the making. Building intelligent systems: NOVELMAN, Ryuu AI OS, GrowthMate. Articles, research notes, and raw ideas — a living lab.",
};

// ── HELPERS ────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function readingTimeLabel(min?: number) {
  if (!min) return null;
  return `${min} min read`;
}

// ── PAGE ───────────────────────────────────────────────────
export default function HomePage() {
  const latestArticles = getArticles().slice(0, 3);
  const featuredArticles = getFeaturedArticles().slice(0, 3);
  const displayArticles = featuredArticles.length > 0 ? featuredArticles : latestArticles;
  const activeProjects = getProjects()
    .filter((p) => p.projectStatus === "active" || p.projectStatus === "experimental")
    .slice(0, 3);
  const allProjects = getProjects().slice(0, 3);
  const displayProjects = activeProjects.length > 0 ? activeProjects : allProjects;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="page-section"
        style={{
          minHeight: "clamp(420px, 70vh, 660px)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle ruled-paper overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 27px, rgba(28,26,21,0.04) 27px, rgba(28,26,21,0.04) 28px)",
            pointerEvents: "none",
          }}
        />

        {/* Subtle neural SVG — very faint, purely decorative */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "min(520px, 50vw)",
            height: "min(520px, 50vw)",
            opacity: 0.032,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Neural network circles + lines, 3% opacity background */}
            <circle cx="100" cy="100" r="80" stroke="#1c1a15" strokeWidth="0.5"/>
            <circle cx="100" cy="100" r="55" stroke="#1c1a15" strokeWidth="0.5"/>
            <circle cx="100" cy="100" r="30" stroke="#1c1a15" strokeWidth="0.5"/>
            {[0,45,90,135,180,225,270,315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 100 + 30 * Math.cos(rad);
              const y1 = 100 + 30 * Math.sin(rad);
              const x2 = 100 + 80 * Math.cos(rad);
              const y2 = 100 + 80 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1c1a15" strokeWidth="0.4"/>;
            })}
            {[0,45,90,135,180,225,270,315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = 100 + 55 * Math.cos(rad);
              const y = 100 + 55 * Math.sin(rad);
              return <circle key={`n${i}`} cx={x} cy={y} r="2" fill="#1c1a15"/>;
            })}
          </svg>
        </div>

        <div className="section-container" style={{ position: "relative" }}>
          {/* Current focus — mono label */}
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
              letterSpacing: "0.12em",
              color: "var(--ink-mid)",
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}
          >
            3rd year engineering · AI/ML
          </p>

          {/* Name */}
          <h1
            className="hero-name"
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              marginBottom: "0.75rem",
              maxWidth: "16ch",
            }}
          >
            Sumit Kolgire
          </h1>

          {/* One-line identity */}
          <p
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "var(--ink-mid)",
              marginBottom: "1.75rem",
              maxWidth: "38ch",
              lineHeight: 1.5,
            }}
          >
            Building systems that augment human intelligence.
          </p>

          {/* Current build indicator */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "2.5rem",
            }}
          >
            <StatusBadge status="building" />
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.78rem",
                color: "var(--ink)",
                letterSpacing: "0.04em",
              }}
            >
              NOVELMAN · Ryuu AI OS · GrowthMate
            </span>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link
              href="/articles"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                padding: "0.65rem 1.4rem",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
                display: "inline-block",
                transition: "opacity 0.2s",
              }}
            >
              Read the writing
            </Link>
            <Link
              href="/about"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                padding: "0.65rem 1.4rem",
                border: "1px solid var(--ink-faint)",
                color: "var(--ink)",
                textDecoration: "none",
                display: "inline-block",
                transition: "border-color 0.2s",
              }}
            >
              About me
            </Link>
          </div>
        </div>
      </section>

      <InkDivider />

      {/* ── LATEST WRITING ──────────────────────────────── */}
      <section id="latest-writing" className="page-section">
        <div className="section-container">
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.25rem, 3vw, 1.6rem)",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              Latest Writing
            </h2>
            <Link
              href="/articles"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.75rem",
                color: "var(--seal)",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              All articles →
            </Link>
          </div>

          {displayArticles.length === 0 ? (
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--ink-mid)" }}>
              Writing is being transferred from ink to screen. Soon.
            </p>
          ) : (
            <div className="grid-responsive-3">
              {displayArticles.map((article) => (
                <OffsetShadowCard key={article.slug} href={`/articles/${article.slug}`}>
                  {/* Type + date */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "var(--seal)",
                        textTransform: "uppercase",
                      }}
                    >
                      Article
                    </span>
                    <time
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.65rem",
                        color: "var(--ink-mid)",
                      }}
                    >
                      {formatDate(article.date)}
                    </time>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      color: "var(--ink)",
                      lineHeight: 1.35,
                    }}
                  >
                    {article.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--ink-mid)",
                      lineHeight: 1.6,
                      margin: "0 0 0.75rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Tags + reading time */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      {article.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.6rem",
                            letterSpacing: "0.06em",
                            color: "var(--ink-mid)",
                            background: "var(--paper-3)",
                            padding: "0.15rem 0.4rem",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {article.readingTime && (
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "0.62rem",
                          color: "var(--ink-mid)",
                        }}
                      >
                        {readingTimeLabel(article.readingTime)}
                      </span>
                    )}
                  </div>
                </OffsetShadowCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <InkDivider />

      {/* ── ACTIVE PROJECTS ─────────────────────────────── */}
      <section id="active-projects" className="page-section">
        <div className="section-container">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.25rem, 3vw, 1.6rem)",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              Active Projects
            </h2>
            <Link
              href="/projects"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.75rem",
                color: "var(--seal)",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              All projects →
            </Link>
          </div>

          {displayProjects.length === 0 ? (
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--ink-mid)" }}>
              Projects being catalogued.
            </p>
          ) : (
            <div className="grid-responsive-3">
              {displayProjects.map((project) => (
                <OffsetShadowCard key={project.slug} href={`/projects/${project.slug}`}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <StatusBadge status={project.projectStatus} />
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      color: "var(--ink)",
                      lineHeight: 1.3,
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--ink-mid)",
                      lineHeight: 1.6,
                      margin: "0 0 1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {project.excerpt}
                  </p>

                  {/* Stack tags */}
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {project.stack.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "0.6rem",
                          letterSpacing: "0.06em",
                          color: "var(--cyan)",
                          border: "1px solid var(--cyan)",
                          padding: "0.1rem 0.35rem",
                          opacity: 0.8,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </OffsetShadowCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <InkDivider />

      {/* ── OBSESSION BLOCK ─────────────────────────────── */}
      <section id="current-obsession" className="page-section">
        <div className="section-container">
          <div
            style={{
              maxWidth: "660px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: "var(--ink-mid)",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              What I&apos;m thinking about right now
            </p>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "var(--ink)",
                lineHeight: 1.3,
              }}
            >
              Multi-agent systems and the question of emergent intent.
            </h2>
            <p
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                color: "var(--ink-mid)",
                lineHeight: 1.8,
                maxWidth: "56ch",
              }}
            >
              When multiple specialized agents coordinate, does the system develop
              something that resembles intent? And if so — who is responsible for
              its decisions? I&apos;m building Ryuu AI OS to test this in practice,
              not theory.
            </p>
          </div>
        </div>
      </section>

      <InkDivider />

      {/* ── NEWSLETTER ──────────────────────────────────── */}
      <section id="newsletter" className="page-section">
        <div className="section-container">
          <div style={{ maxWidth: "520px" }}>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: "var(--ink-mid)",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Newsletter
            </p>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.25rem, 3vw, 1.6rem)",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: "var(--ink)",
              }}
            >
              Rare dispatches from the lab.
            </h2>
            <HaikuNewsletter />
          </div>
        </div>
      </section>
    </>
  );
}
