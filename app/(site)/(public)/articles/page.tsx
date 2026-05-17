import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, getAllTags } from "@/lib/velite";
import { OffsetShadowCard } from "@/components/wabi/OffsetShadowCard";
import { InkDivider } from "@/components/wabi/InkDivider";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays, research notes, and system thinking from Sumit Kolgire — AI/ML engineer.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const articles = getArticles();
  const allTags = getAllTags();

  // Resolve tag synchronously — searchParams is a plain object at build time
  // We read it via prop (Next.js 15+ async searchParams)
  // For now, read the URL param via a simpler pattern
  return <ArticlesClient articles={articles} allTags={allTags} />;
}

// ── CLIENT-SAFE COMPONENT (pure props, no async) ─────────────────
function ArticlesClient({
  articles,
  allTags,
}: {
  articles: ReturnType<typeof getArticles>;
  allTags: string[];
}) {
  return (
    <>
      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <section className="page-section" style={{ paddingBottom: "2rem" }}>
        <div className="section-container">
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
            Writing
          </p>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "0.75rem",
              lineHeight: 1.15,
            }}
          >
            Essays & Research Notes
          </h1>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "var(--ink-mid)",
              maxWidth: "52ch",
              lineHeight: 1.7,
            }}
          >
            Long-form thinking on AI, systems, and the craft of building.
            Writing is how I think.
          </p>
        </div>
      </section>

      <InkDivider />

      {/* ── TAG FILTER ────────────────────────────────── */}
      {allTags.length > 0 && (
        <section style={{ padding: "1.5rem 1.25rem" }}>
          <div className="section-container">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.68rem",
                  color: "var(--ink-mid)",
                  letterSpacing: "0.08em",
                  marginRight: "0.25rem",
                }}
              >
                Filter:
              </span>
              <Link
                href="/articles"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.7rem",
                  padding: "0.2rem 0.55rem",
                  border: "1px solid var(--ink)",
                  textDecoration: "none",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  letterSpacing: "0.04em",
                }}
              >
                All
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.55rem",
                    border: "1px solid var(--ink-faint)",
                    color: "var(--ink-mid)",
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ARTICLES LIST ─────────────────────────────── */}
      <section className="page-section" style={{ paddingTop: "2rem" }}>
        <div className="section-container">
          {articles.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.9rem",
                color: "var(--ink-mid)",
              }}
            >
              No articles published yet. Ink is drying.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {articles.map((article) => (
                <OffsetShadowCard
                  key={article.slug}
                  href={`/articles/${article.slug.split("/").pop()}`}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      alignItems: "center",
                      marginBottom: "0.6rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {article.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.62rem",
                            letterSpacing: "0.08em",
                            color: "var(--seal)",
                            textTransform: "uppercase",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                      }}
                    >
                      {article.readingTime && (
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.65rem",
                            color: "var(--ink-mid)",
                          }}
                        >
                          {article.readingTime} min
                        </span>
                      )}
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
                  </div>

                  <h2
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                      fontWeight: 700,
                      color: "var(--ink)",
                      marginBottom: "0.5rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {article.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--ink-mid)",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {article.excerpt}
                  </p>
                </OffsetShadowCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
