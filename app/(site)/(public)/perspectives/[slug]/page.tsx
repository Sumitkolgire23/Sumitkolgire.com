import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerspectiveBySlug, getPerspectives, urlSlug } from "@/lib/velite";
import { MDXContent } from "@/components/mdx-content";
import { InkDivider } from "@/components/wabi/InkDivider";
import { TableOfContents } from "@/components/wabi/TableOfContents";
import { ReactionBar } from "@/components/wabi/ReactionBar";
import { ScrollMemory } from "@/components/wabi/ScrollMemory";
import { ReaderControls } from "@/components/wabi/ReaderControls";
import { getSemanticRelatedPosts } from "@/lib/semantic";
import { generateInsightBadge } from "@/lib/ai-helper";
import { GlowCard } from "@/components/ui/GlowCard";
import Link from "next/link";

export function generateStaticParams() {
  return getPerspectives().map((p) => ({ slug: urlSlug(p.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pov = getPerspectiveBySlug(slug);
  if (!pov) return { title: "Not Found" };
  return { title: pov.title, description: pov.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function PerspectivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pov = getPerspectiveBySlug(slug);
  if (!pov) notFound();

  // Fetch semantic related posts and dynamic AI insight badge
  const [related, insight] = await Promise.all([
    getSemanticRelatedPosts(pov.slug, 3),
    generateInsightBadge(pov.title, pov.excerpt, pov.slug),
  ]);

  return (
    <>
      {/* ── READING PROGRESS BAR ────────────────────── */}
      <div className="reading-bar css-scroll" aria-hidden="true" />

      {/* ── SPATIAL MEMORY ──────────────────────────── */}
      <ScrollMemory />

      {/* ── READER CONTROLS ─────────────────────────── */}
      <ReaderControls />

      <div 
        className="reader-grid" 
        style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          display: "grid", 
          gap: "40px", 
          padding: "40px 20px" 
        }}
      >
        <article itemScope itemType="https://schema.org/Article">
          <header className="page-section" style={{ paddingBottom: "2rem", paddingTop: "2rem" }}>
            <div className="section-container" style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
              {/* Tags + contested badge */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                {pov.contested && (
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--seal)", border: "1px solid var(--seal)", padding: "0.15rem 0.5rem" }}>
                    CONTESTED
                  </span>
                )}
                {pov.tags.map((tag: string) => (
                  <a key={tag} href={`/tags/${tag}`} style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--ink-mid)", textDecoration: "none", textTransform: "uppercase" }}>
                    {tag}
                  </a>
                ))}
              </div>

              <h1 itemProp="headline" style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "1rem" }}>
                {pov.title}
              </h1>

              {/* Nirvana Insight Badge */}
              {insight && (
                <div
                  style={{
                    background: "rgba(196, 30, 58, 0.02)",
                    border: "1px solid rgba(196, 30, 58, 0.15)",
                    padding: "12px 18px",
                    borderRadius: "4px",
                    marginBottom: "1.5rem",
                    maxWidth: "52ch",
                  }}
                  className="animate-fade-in"
                >
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-seal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-seal"></span>
                    </span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--seal)", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600 }}>
                      Nirvana Insight
                    </span>
                  </div>
                  <p style={{ fontSize: "12.5px", fontStyle: "italic", color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
                    {insight}
                  </p>
                </div>
              )}

              {/* Stance — the core claim */}
              <blockquote style={{ borderLeft: "3px solid var(--seal)", paddingLeft: "1.25rem", margin: "1.25rem 0", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.1rem", color: "var(--seal)", lineHeight: 1.6 }}>
                {pov.stance}
              </blockquote>

              {/* Counter view */}
              {pov.counterView && (
                <p style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--ink-mid)", letterSpacing: "0.04em", marginBottom: "1rem" }}>
                  <strong>Where I might be wrong:</strong> {pov.counterView}
                </p>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", borderTop: "1px solid var(--ink-faint)", paddingTop: "1rem" }}>
                <time itemProp="datePublished" dateTime={pov.date} style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--ink-mid)" }}>
                  {formatDate(pov.date)}
                </time>
              </div>
            </div>
          </header>

          <div className="prose-wabi" style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "1rem 1.25rem 4rem" }} itemProp="articleBody">
            <MDXContent code={pov.body} />
            <ReactionBar postSlug={pov.slug} />
          </div>

          <div style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "0 1.25rem 2rem" }}>
            <a href="/perspectives" style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--ink-mid)", textDecoration: "none", letterSpacing: "0.04em" }}>
              ← All perspectives
            </a>
          </div>
        </article>

        {/* ── SIDEBAR ─────────────────────────────────── */}
        <aside className="article-sidebar" style={{ position: "sticky", top: "100px", alignSelf: "start" }}>
          <TableOfContents selector=".prose-wabi" />
        </aside>
      </div>

      <style>{`
        /* Desktop Reader Grid */
        @media (min-width: 1024px) {
          .reader-grid {
            grid-template-columns: 1fr 240px;
          }
        }
        /* Mobile Reader Grid */
        @media (max-width: 1023px) {
          .reader-grid {
            grid-template-columns: 1fr;
          }
          .article-sidebar {
            display: none;
          }
        }
      `}</style>

      {/* ── RELATED ARTICLES ─────────────────────────── */}
      {related.length > 0 && (
        <>
          <InkDivider />
          <section className="page-section">
            <div className="section-container">
              <h2
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "1.5rem",
                  color: "var(--ink)",
                }}
              >
                Related Writing
              </h2>
              <div className="grid-responsive-3">
                {related.map(({ item, type, similarity, connectionReason }) => {
                  const href = type === "article" ? `/articles/${urlSlug(item.slug)}` :
                               type === "perspective" ? `/perspectives/${urlSlug(item.slug)}` :
                               type === "project" ? `/projects/${urlSlug(item.slug)}` : `/docs/${urlSlug(item.slug)}`;
                  return (
                    <Link key={item.slug} href={href} style={{ textDecoration: "none" }}>
                      <GlowCard style={{ padding: "1.5rem", border: "1px solid var(--border)", transition: "border-color 0.2s" }} className="article-card-lift">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                          <p
                            style={{
                              fontFamily: "var(--mono)",
                              fontSize: "0.65rem",
                              color: "var(--seal)",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              margin: 0,
                            }}
                          >
                            {type} · {item.date ? new Date(item.date).getFullYear() : "Lab"}
                          </p>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "8px", color: "var(--text4)" }}>
                            Match: {Math.round(similarity * 100)}%
                          </span>
                        </div>
                        <h3
                          style={{
                            fontFamily: "var(--serif)",
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            color: "var(--ink)",
                            lineHeight: 1.3,
                            marginBottom: "8px",
                          }}
                        >
                          {item.title}
                        </h3>
                        <p style={{ fontSize: "11px", color: "var(--text3)", fontStyle: "italic", borderLeft: "1px solid var(--border2)", paddingLeft: "8px", margin: 0, lineHeight: 1.5 }}>
                          {connectionReason}
                        </p>
                      </GlowCard>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
