import type { Metadata } from "next";
import { getArticles, getAllTags } from "@/lib/velite";
import { ArticlesListing } from "./ArticlesListing";

export const metadata: Metadata = {
  title: "Writing — Sumit Kolgire",
  description:
    "Essays, research notes, and system thinking. AI/ML, product architecture, and the craft of building.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const activeTag = params.tag ?? null;

  const allArticles = getArticles().map(a => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    tags: a.tags,
    readingTime: a.readingTime,
  }));
  
  const allTags = getAllTags();

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "80px 40px 60px",
        }}
      >
        <div style={{ maxWidth: "var(--site-width)", margin: "0 auto" }}>
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

      {/* ── CLIENT-SIDE LISTING (Sidebar + Grid) ───────────────── */}
      <ArticlesListing 
        allArticles={allArticles} 
        allTags={allTags} 
        initialTag={activeTag} 
      />

    </main>
  );
}
