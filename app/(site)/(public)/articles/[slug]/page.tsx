import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { getArticleBySlug, getArticles, getRelatedArticles, urlSlug } from "@/lib/velite";
import { MDXContent } from "@/components/mdx-content";
import { OffsetShadowCard } from "@/components/wabi/OffsetShadowCard";
import { InkDivider } from "@/components/wabi/InkDivider";

// ── STATIC PARAMS ─────────────────────────────────────────
export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: urlSlug(a.slug) }));
}


// ── METADATA ──────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updated,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── PAGE ──────────────────────────────────────────────────
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.slug, article.tags, 3);

  return (
    <>
      {/* ── ARTICLE HEADER ──────────────────────────── */}
      <article itemScope itemType="https://schema.org/Article">
        <header className="page-section" style={{ paddingBottom: "2rem" }}>
          <div
            className="section-container"
            style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}
          >
            {/* Tags */}
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}
            >
              {article.tags.map((tag: string) => (
                <a
                  key={tag}
                  href={`/tags/${tag}`}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    color: "var(--seal)",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  {tag}
                </a>
              ))}
            </div>

            {/* Title */}
            <h1
              itemProp="headline"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                marginBottom: "1rem",
              }}
            >
              {article.title}
            </h1>

            {/* Excerpt */}
            <p
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: "1.05rem",
                color: "var(--ink-mid)",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                maxWidth: "52ch",
              }}
            >
              {article.excerpt}
            </p>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "center",
                borderTop: "1px solid var(--ink-faint)",
                paddingTop: "1rem",
              }}
            >
              <time
                itemProp="datePublished"
                dateTime={article.date}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.72rem",
                  color: "var(--ink-mid)",
                  letterSpacing: "0.04em",
                }}
              >
                {formatDate(article.date)}
              </time>
              {article.updated && article.updated !== article.date && (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.72rem",
                    color: "var(--ink-mid)",
                    opacity: 0.7,
                  }}
                >
                  Updated {formatDate(article.updated)}
                </span>
              )}
              {article.readingTime && (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.72rem",
                    color: "var(--ink-mid)",
                  }}
                >
                  {article.readingTime} min read
                </span>
              )}
              {article.wordCount && (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.72rem",
                    color: "var(--ink-mid)",
                    opacity: 0.6,
                  }}
                >
                  {article.wordCount.toLocaleString()} words
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ── ARTICLE BODY ────────────────────────────── */}
        <div
          className="page-section prose-wabi"
          style={{
            paddingTop: "1rem",
            maxWidth: "var(--content-width)",
            margin: "0 auto",
            padding: "1rem 1.25rem 4rem",
          }}
          itemProp="articleBody"
        >
          <MDXContent code={article.body} />
        </div>

        {/* ── BACK LINK ─────────────────────────────── */}
        <div
          style={{
            maxWidth: "var(--content-width)",
            margin: "0 auto",
            padding: "0 1.25rem 2rem",
          }}
        >
          <a
            href="/articles"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.75rem",
              color: "var(--ink-mid)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            ← All articles
          </a>
        </div>
      </article>

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
                {related.map((rel) => (
                  <OffsetShadowCard key={rel.slug} href={`/articles/${urlSlug(rel.slug)}`}>
                    <p
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.65rem",
                        color: "var(--seal)",
                        marginBottom: "0.4rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {new Date(rel.date).getFullYear()}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--ink)",
                        lineHeight: 1.3,
                        margin: 0,
                      }}
                    >
                      {rel.title}
                    </h3>
                  </OffsetShadowCard>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
