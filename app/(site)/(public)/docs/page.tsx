import type { Metadata } from "next";
import { getDocs, getAllDocsTags } from "@/lib/velite";
import { DocsListing } from "./DocsListing";

export const metadata: Metadata = {
  title: "Docs",
  description: "Technical notes and reference docs from Sumit Kolgire — published for his own use, shared in case useful.",
};

export default function DocsPage() {
  const docs = getDocs().map(d => ({
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt,
    tags: d.tags,
  }));
  const allTags = getAllDocsTags ? getAllDocsTags() : []; // Fallback in case not exported

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
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
            Docs
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)", fontSize: "clamp(2rem, 4vw, 3rem)",
              fontStyle: "italic", fontWeight: 400, color: "var(--text)",
              lineHeight: 1.1, marginBottom: "16px",
            }}
          >
            Technical Notes
          </h1>
          <p
            style={{
              fontSize: "15px", color: "var(--text2)", lineHeight: 1.75,
              maxWidth: "50ch", fontStyle: "italic",
            }}
          >
            Reference docs written for my own use. Published in case they're useful to you too.
          </p>
        </div>
      </section>

      <DocsListing allDocs={docs} allTags={allTags} />
    </main>
  );
}
