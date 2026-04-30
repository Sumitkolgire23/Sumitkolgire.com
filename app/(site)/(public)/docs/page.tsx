import type { Metadata } from "next";
import { getDocs } from "@/lib/velite";
import { OffsetShadowCard } from "@/components/wabi/OffsetShadowCard";
import { InkDivider } from "@/components/wabi/InkDivider";

export const metadata: Metadata = {
  title: "Docs",
  description: "Technical notes and reference docs from Sumit Kolgire — published for his own use, shared in case useful.",
};

export default function DocsPage() {
  const docs = getDocs();

  return (
    <>
      <section className="page-section" style={{ paddingBottom: "2rem" }}>
        <div className="section-container">
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Docs
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.75rem", lineHeight: 1.15 }}>
            Technical Notes
          </h1>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1rem", color: "var(--ink-mid)", maxWidth: "52ch", lineHeight: 1.7 }}>
            Reference docs written for my own use. Published in case they're useful to you too.
          </p>
        </div>
      </section>

      <InkDivider />

      <section className="page-section" style={{ paddingTop: "2rem" }}>
        <div className="section-container">
          {docs.length === 0 ? (
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", color: "var(--ink-mid)" }}>
              No docs yet. Writing them as I build.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {docs.map((doc) => (
                <OffsetShadowCard key={doc.slug} href={`/docs/${doc.slug.split("/").pop()}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {doc.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.08em", color: "var(--teal)", textTransform: "uppercase" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1rem, 2vw, 1.1rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.35rem", lineHeight: 1.3 }}>
                    {doc.title}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", lineHeight: 1.6, margin: 0 }}>
                    {doc.excerpt}
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
