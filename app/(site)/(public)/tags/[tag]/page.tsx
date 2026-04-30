import type { Metadata } from "next";
import { getContentByTag, getAllTags } from "@/lib/velite";
import { OffsetShadowCard } from "@/components/wabi/OffsetShadowCard";
import { InkDivider } from "@/components/wabi/InkDivider";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} — Sumit Kolgire`,
    description: `All writing, projects, and docs tagged with "${tag}".`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const { articles, perspectives, projects, docs } = getContentByTag(tag);
  const total = articles.length + perspectives.length + projects.length + docs.length;

  return (
    <>
      <section className="page-section" style={{ paddingBottom: "2rem" }}>
        <div className="section-container">
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Tag
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem", lineHeight: 1.15 }}>
            #{tag}
          </h1>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--ink-mid)", letterSpacing: "0.04em" }}>
            {total} {total === 1 ? "item" : "items"}
          </p>
        </div>
      </section>

      <InkDivider />

      <section className="page-section" style={{ paddingTop: "2rem" }}>
        <div className="section-container">
          {total === 0 && (
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", color: "var(--ink-mid)" }}>
              Nothing tagged with this yet.
            </p>
          )}

          {/* Articles */}
          {articles.length > 0 && (
            <div style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "1rem" }}>
                Articles
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {articles.map((a) => (
                  <OffsetShadowCard key={a.slug} href={`/articles/${a.slug.split("/").pop()}`}>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", marginTop: "0.35rem", lineHeight: 1.6 }}>{a.excerpt}</p>
                  </OffsetShadowCard>
                ))}
              </div>
            </div>
          )}

          {/* Perspectives */}
          {perspectives.length > 0 && (
            <div style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "1rem" }}>
                Perspectives
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {perspectives.map((p) => (
                  <OffsetShadowCard key={p.slug} href={`/perspectives/${p.slug.split("/").pop()}`}>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{p.title}</h3>
                    <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "0.875rem", color: "var(--seal)", marginTop: "0.35rem" }}>{p.stance}</p>
                  </OffsetShadowCard>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "1rem" }}>
                Projects
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {projects.map((p) => (
                  <OffsetShadowCard key={p.slug} href={`/projects/${p.slug.split("/").pop()}`}>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{p.title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", marginTop: "0.35rem", lineHeight: 1.6 }}>{p.excerpt}</p>
                  </OffsetShadowCard>
                ))}
              </div>
            </div>
          )}

          {/* Docs */}
          {docs.length > 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "1rem" }}>
                Docs
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {docs.map((d) => (
                  <OffsetShadowCard key={d.slug} href={`/docs/${d.slug.split("/").pop()}`}>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{d.title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", marginTop: "0.35rem", lineHeight: 1.6 }}>{d.excerpt}</p>
                  </OffsetShadowCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
