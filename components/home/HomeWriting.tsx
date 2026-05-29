"use client";

import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";


type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  tags: string[];
  readingTime?: number;
};

const TYPE_DOT: Record<string, string> = {
  perspective: "var(--seal)",
  technical:   "var(--sky)",
  idea:        "var(--gold)",
  lab:         "var(--moss)",
};

function typeLabel(tags: string[]): { label: string; color: string } {
  if (tags.some(t => /perspective/i.test(t))) return { label: "Perspective", color: TYPE_DOT.perspective };
  if (tags.some(t => /lab|experiment/i.test(t)))  return { label: "Lab note",    color: TYPE_DOT.lab };
  if (tags.some(t => /idea/i.test(t)))            return { label: "Raw idea",   color: TYPE_DOT.idea };
  return { label: "Technical", color: TYPE_DOT.technical };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

export function HomeWriting({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <section id="writing" className="page-section" style={{ background: "var(--bg)" }}>
        <div className="section-container">
          <p style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--text3)" }}>
            Writing is being transferred from ink to screen. Soon.
          </p>
        </div>
      </section>
    );
  }

  const [wide, ...rest] = articles;
  const wideType = typeLabel(wide.tags);

  return (
    <section id="writing" className="page-section" style={{ background: "var(--bg)", position: "relative" }}>
      {/* Faint section background letter */}
      <div aria-hidden="true" style={{ position: "absolute", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "200px", color: "rgba(255,255,255,.015)", pointerEvents: "none", userSelect: "none", right: "28px", top: "32px", lineHeight: 1 }}>W</div>

      <div className="section-container">
        {/* Section header */}
        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "44px", paddingBottom: "14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontStyle: "italic", color: "rgba(255,255,255,.04)", lineHeight: 1, minWidth: "36px" }}>01</span>
            <div>
              <span className="section-title" style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text)" }}>Latest Writing</span>
              <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginTop: "3px", letterSpacing: ".1em", textTransform: "uppercase" }}>Articles · Perspectives · Lab notes</span>
            </div>
          </div>
          <Link href="/articles" style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--seal)", textDecoration: "none", letterSpacing: ".07em", display: "flex", alignItems: "center", gap: "5px" }}>
            All posts →
          </Link>
        </div>

        {/* Writing grid — 3-col border grid like the design */}
        <div
          className="reveal writing-inner"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--border)", border: "1px solid var(--border)" }}
        >
          {/* Wide featured article */}
          <GlowCard className="article-card-lift wide-entry" style={{ gridColumn: "span 2" }}>
            <Link
              href={`/articles/${wide.slug}`}
              style={{ display: "block", padding: "28px", cursor: "pointer", textDecoration: "none", color: "inherit", position: "relative", zIndex: 2 }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginBottom: "12px", letterSpacing: ".09em", textTransform: "uppercase" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: wideType.color, display: "inline-block" }} />
                {wideType.label}
              </div>
              <div>
                <h3 className="underline-draw" style={{ display: "inline-block", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.42rem", lineHeight: 1.35, color: "var(--text)", marginBottom: "10px", fontWeight: 400 }}>{wide.title}</h3>
              </div>
              {wide.excerpt && <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.72, marginBottom: "18px" }}>{wide.excerpt}</p>}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)" }}>{formatDate(wide.date)}</span>
                {wide.tags.slice(0, 2).map(t => (
                  <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", padding: "1px 7px" }}>{t}</span>
                ))}
              </div>
            </Link>
          </GlowCard>

          {/* Remaining articles */}
          {rest.map(article => {
            const { label, color } = typeLabel(article.tags);
            return (
              <GlowCard key={article.slug} className="article-card-lift">
                <Link
                  href={`/articles/${article.slug}`}
                  style={{ display: "block", padding: "28px", textDecoration: "none", color: "inherit", position: "relative", zIndex: 2 }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", marginBottom: "12px", letterSpacing: ".09em", textTransform: "uppercase" }}>
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: color, display: "inline-block" }} />
                    {label}
                  </div>
                  <div>
                    <h3 className="underline-draw" style={{ display: "inline-block", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.08rem", lineHeight: 1.35, color: "var(--text)", marginBottom: "10px", fontWeight: 400 }}>{article.title}</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)" }}>{formatDate(article.date)}</span>
                    {article.tags.slice(0, 1).map(t => (
                      <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", padding: "1px 7px" }}>{t}</span>
                    ))}
                  </div>
                </Link>
              </GlowCard>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #writing .writing-inner { grid-template-columns: 1fr !important; }
          #writing .wide-entry { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  );
}
