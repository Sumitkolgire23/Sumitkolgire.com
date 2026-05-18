import type { Metadata } from "next";
import Link from "next/link";
import { getContentByTag, getAllTags } from "@/lib/velite";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} — Sumit Kolgire`,
    description: `All writing, projects, and docs tagged with "${tag}".`,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

type ContentSection = {
  label: string;
  color: string;
  items: { slug: string; title: string; excerpt: string; date?: string; href: string }[];
};

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const { articles, perspectives, projects, docs } = getContentByTag(tag);

  const total = articles.length + perspectives.length + projects.length + docs.length;

  const sections: ContentSection[] = [
    {
      label: "Writing",
      color: "var(--seal)",
      items: articles.map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        date: a.date,
        href: `/articles/${a.slug.split("/").pop()}`,
      })),
    },
    {
      label: "Perspectives",
      color: "var(--teal)",
      items: perspectives.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: (p as any).stance ?? p.excerpt,
        date: p.date,
        href: `/perspectives/${p.slug.split("/").pop()}`,
      })),
    },
    {
      label: "Projects",
      color: "var(--gold)",
      items: projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        href: `/projects/${p.slug.split("/").pop()}`,
      })),
    },
    {
      label: "Docs",
      color: "var(--ok)",
      items: docs.map((d) => ({
        slug: d.slug,
        title: d.title,
        excerpt: d.excerpt,
        href: `/docs/${d.slug.split("/").pop()}`,
      })),
    },
  ].filter((s) => s.items.length > 0);

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
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
            Tag
          </div>

          <h1
            style={{
              fontFamily: "var(--serif)", fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontStyle: "italic", fontWeight: 400, color: "var(--text)",
              lineHeight: 1.1, marginBottom: "16px",
            }}
          >
            #{tag}
          </h1>

          <p
            style={{
              fontFamily: "var(--mono)", fontSize: "11px",
              color: "var(--text3)", letterSpacing: "0.08em",
            }}
          >
            {total} {total === 1 ? "item" : "items"} across{" "}
            {sections.map((s) => s.label.toLowerCase()).join(", ")}
          </p>
        </div>
      </section>

      {/* ── RESULTS ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "var(--site-width)",
          margin: "0 auto",
          padding: "60px 40px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "56px",
        }}
      >
        {total === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p
              style={{
                fontFamily: "var(--mono)", fontSize: "13px",
                color: "var(--text3)", letterSpacing: ".06em",
              }}
            >
              Nothing tagged with this yet.
            </p>
            <Link
              href="/articles"
              style={{
                fontFamily: "var(--mono)", fontSize: "11px",
                color: "var(--seal)", textDecoration: "none",
                display: "inline-block", marginTop: "16px",
              }}
            >
              ← Browse all writing
            </Link>
          </div>
        ) : (
          sections.map((section) => (
            <div key={section.label}>
              {/* Section heading */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)", fontSize: "9px",
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    color: section.color,
                    border: `1px solid ${section.color}`,
                    padding: "3px 8px",
                  }}
                >
                  {section.label}
                </span>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                <span
                  style={{
                    fontFamily: "var(--mono)", fontSize: "9px",
                    color: "var(--text4)", letterSpacing: "0.06em",
                  }}
                >
                  {section.items.length}
                </span>
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {section.items.map((item, i, arr) => (
                  <Link
                    key={item.slug}
                    href={item.href}
                    style={{ textDecoration: "none" }}
                  >
                    <article
                      style={{
                        padding: "22px 0",
                        borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                        transition: "all .18s",
                        display: "grid",
                        gap: "8px",
                      }}
                      className="tag-item"
                    >
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <h3
                          style={{
                            fontFamily: "var(--serif)", fontSize: "1.1rem",
                            fontStyle: "italic", fontWeight: 400,
                            color: "var(--text)", margin: 0, lineHeight: 1.3,
                          }}
                        >
                          {item.title}
                        </h3>
                        {item.date && (
                          <time
                            style={{
                              fontFamily: "var(--mono)", fontSize: "9px",
                              color: "var(--text4)", marginLeft: "auto",
                              flexShrink: 0,
                            }}
                          >
                            {formatDate(item.date)}
                          </time>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "13px", color: "var(--text2)",
                          lineHeight: 1.65, margin: 0, maxWidth: "65ch",
                        }}
                      >
                        {item.excerpt}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .tag-item:hover h3 { color: var(--seal) !important; }
        .tag-item:hover { background: var(--bg2); padding-left: 14px; padding-right: 14px; margin-left: -14px; margin-right: -14px; }

        @media (max-width: 640px) {
          section, div { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </main>
  );
}
