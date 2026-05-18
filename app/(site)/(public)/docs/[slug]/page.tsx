import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocBySlug, getDocs, urlSlug } from "@/lib/velite";
import { MDXContent } from "@/components/mdx-content";
import { ReadingProgress } from "@/components/wabi/ReadingProgress";
import { TableOfContents } from "@/components/wabi/TableOfContents";

export function generateStaticParams() {
  return getDocs().map((d) => ({ slug: urlSlug(d.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return { title: "Not Found" };
  return { title: doc.title, description: doc.excerpt };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  return (
    <>
      <ReadingProgress />

      <div
        className="reader-grid"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gap: "40px",
          padding: "40px 20px",
        }}
      >
        <article itemScope itemType="https://schema.org/TechArticle">
          <header className="page-section" style={{ paddingBottom: "2rem", paddingTop: "2rem" }}>
            <div className="section-container" style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
              {/* Tags */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                {doc.tags.map((tag: string) => (
                  <a
                    key={tag}
                    href={`/tags/${tag}`}
                    style={{
                      fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.1em",
                      color: "var(--teal)", textDecoration: "none", textTransform: "uppercase",
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
                  fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                  fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em",
                  color: "var(--ink)", marginBottom: "1rem",
                }}
              >
                {doc.title}
              </h1>

              {/* Excerpt */}
              <p
                style={{
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05rem",
                  color: "var(--ink-mid)", lineHeight: 1.7, maxWidth: "52ch",
                }}
              >
                {doc.excerpt}
              </p>
            </div>
          </header>

          <div
            className="prose-wabi"
            style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "1rem 1.25rem 4rem" }}
            itemProp="articleBody"
          >
            <MDXContent code={doc.body} />
          </div>

          <div style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "0 1.25rem 2rem" }}>
            <a href="/docs" style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--ink-mid)", textDecoration: "none" }}>
              ← All docs
            </a>
          </div>
        </article>

        {/* ── SIDEBAR ─────────────────────────────────── */}
        <aside className="article-sidebar" style={{ position: "sticky", top: "100px", alignSelf: "start" }}>
          <TableOfContents selector=".prose-wabi" />
        </aside>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .reader-grid { grid-template-columns: 1fr 240px; }
        }
        @media (max-width: 1023px) {
          .reader-grid { grid-template-columns: 1fr; }
          .article-sidebar { display: none; }
        }
      `}</style>
    </>
  );
}
