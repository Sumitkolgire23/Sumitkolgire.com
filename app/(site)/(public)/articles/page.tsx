import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, getAllTags } from "@/lib/velite";

export const metadata: Metadata = {
  title: "Writing — Sumit Kolgire",
  description:
    "Essays, research notes, and system thinking. AI/ML, product architecture, and the craft of building.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const activeTag = params.tag ?? null;

  const allArticles = getArticles();
  const allTags = getAllTags();
  const articles = activeTag
    ? allArticles.filter(a => a.tags.includes(activeTag))
    : allArticles;

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
            Writing
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)", fontSize: "clamp(2rem, 4vw, 3rem)",
              fontStyle: "italic", fontWeight: 400, color: "var(--text)",
              lineHeight: 1.1, marginBottom: "16px",
            }}
          >
            Essays &amp; Research Notes
          </h1>
          <p
            style={{
              fontSize: "15px", color: "var(--text2)", lineHeight: 1.75,
              maxWidth: "50ch", fontStyle: "italic",
            }}
          >
            Long-form thinking on AI, systems, and the craft of building.
            Writing is how I think.
          </p>
        </div>
      </section>

      {/* ── TAG FILTER ──────────────────────────────────────────── */}
      {allTags.length > 0 && (
        <section
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "16px 40px",
            background: "var(--bg2)",
          }}
        >
          <div
            style={{
              maxWidth: "var(--section-width)", margin: "0 auto",
              display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text4)",
                letterSpacing: ".12em", textTransform: "uppercase", marginRight: "4px",
              }}
            >
              Filter
            </span>
            <Link
              href="/articles"
              style={{
                fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: ".06em",
                padding: "4px 12px", textDecoration: "none",
                background: !activeTag ? "var(--seal)" : "transparent",
                color: !activeTag ? "#fff" : "var(--text3)",
                border: `1px solid ${!activeTag ? "var(--seal)" : "var(--border)"}`,
                transition: "all .15s",
              }}
            >
              All
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/articles?tag=${encodeURIComponent(tag)}`}
                style={{
                  fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: ".06em",
                  padding: "4px 12px", textDecoration: "none",
                  background: activeTag === tag ? "var(--seal)" : "transparent",
                  color: activeTag === tag ? "#fff" : "var(--text3)",
                  border: `1px solid ${activeTag === tag ? "var(--seal)" : "var(--border)"}`,
                  transition: "all .15s",
                }}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── ARTICLES LIST ───────────────────────────────────────── */}
      <section style={{ padding: "40px 40px 80px" }}>
        <div style={{ maxWidth: "var(--section-width)", margin: "0 auto" }}>
          {articles.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--mono)", fontSize: "13px",
                  color: "var(--text3)", letterSpacing: ".06em",
                }}
              >
                {activeTag
                  ? `No articles tagged "${activeTag}" yet.`
                  : "No articles published yet. Ink is drying."}
              </p>
              {activeTag && (
                <Link
                  href="/articles"
                  style={{
                    fontFamily: "var(--mono)", fontSize: "11px",
                    color: "var(--seal)", textDecoration: "none",
                    display: "inline-block", marginTop: "16px",
                  }}
                >
                  ← View all writing
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {articles.map((article, i, arr) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug.split("/").pop()}`}
                  style={{ textDecoration: "none" }}
                >
                  <article
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr",
                      gap: "32px",
                      padding: "28px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                      transition: "all .2s",
                    }}
                    className="article-row-dark"
                  >
                    {/* Left: date column */}
                    <div style={{ paddingTop: "4px" }}>
                      <time
                        style={{
                          fontFamily: "var(--mono)", fontSize: "10px",
                          color: "var(--text4)", display: "block", lineHeight: 1.5,
                        }}
                      >
                        {formatDate(article.date)}
                      </time>
                    </div>

                    {/* Right: content */}
                    <div>
                      {/* Tags row */}
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px", alignItems: "center" }}>
                        {article.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            style={{
                              fontFamily: "var(--mono)", fontSize: "9px",
                              letterSpacing: ".1em", color: "var(--seal)",
                              textTransform: "uppercase",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {article.readingTime && (
                          <span
                            style={{
                              fontFamily: "var(--mono)", fontSize: "9px",
                              color: "var(--text4)", letterSpacing: ".06em",
                              marginLeft: "auto",
                            }}
                          >
                            {article.readingTime} min read
                          </span>
                        )}
                      </div>

                      <h2
                        style={{
                          fontFamily: "var(--serif)", fontSize: "1.2rem",
                          fontStyle: "italic", fontWeight: 400,
                          color: "var(--text)", lineHeight: 1.3, marginBottom: "8px",
                        }}
                      >
                        {article.title}
                      </h2>

                      <p
                        style={{
                          fontSize: "14px", color: "var(--text2)",
                          lineHeight: 1.7, margin: 0,
                        }}
                      >
                        {article.excerpt}
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
        .article-row-dark:hover h2 { color: var(--seal) !important; }
        .article-row-dark:hover    { background: var(--bg2); padding-left: 12px; padding-right: 12px; }
      `}</style>
    </main>
  );
}
