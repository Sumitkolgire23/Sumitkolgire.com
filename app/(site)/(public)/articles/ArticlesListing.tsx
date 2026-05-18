"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/wabi/SearchInput";

interface ArticleStub {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime?: number;
}

interface ArticlesListingProps {
  allArticles: ArticleStub[];
  allTags: string[];
  initialTag: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function ArticlesListing({ allArticles, allTags, initialTag }: ArticlesListingProps) {
  const [activeTag, setActiveTag] = useState<string | null>(initialTag);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    let result = allArticles;

    // Filter by tag
    if (activeTag) {
      result = result.filter(a => a.tags.includes(activeTag));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allArticles, activeTag, searchQuery]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "40px",
      alignItems: "start",
      padding: "40px 40px 80px",
      maxWidth: "var(--site-width)",
      margin: "0 auto",
    }} className="articles-grid">
      
      {/* ── SIDEBAR (Sticky on Desktop) ───────────────────── */}
      <aside className={`filters-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
        <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <div className="mobile-filters-header hidden-desktop">
            <h3 style={{ fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0, color: "var(--text3)" }}>Filters</h3>
            <button onClick={() => setIsMobileFiltersOpen(false)} style={{ background: "none", border: "none", color: "var(--text)", fontSize: "20px", cursor: "pointer" }}>×</button>
          </div>

          <div>
            <h3 style={{ 
              fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text4)", 
              letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "12px" 
            }}>
              Search
            </h3>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search articles..." />
          </div>

          <div>
            <h3 style={{ 
              fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text4)", 
              letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "12px" 
            }}>
              Topics
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <button
                onClick={() => setActiveTag(null)}
                style={{
                  fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: ".06em",
                  padding: "4px 10px", cursor: "pointer",
                  background: !activeTag ? "var(--seal)" : "var(--bg2)",
                  color: !activeTag ? "#fff" : "var(--text3)",
                  border: `1px solid ${!activeTag ? "var(--seal)" : "var(--border)"}`,
                  transition: "all .15s",
                  borderRadius: "2px"
                }}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: ".06em",
                    padding: "4px 10px", cursor: "pointer",
                    background: activeTag === tag ? "var(--seal)" : "var(--bg2)",
                    color: activeTag === tag ? "#fff" : "var(--text3)",
                    border: `1px solid ${activeTag === tag ? "var(--seal)" : "var(--border)"}`,
                    transition: "all .15s",
                    borderRadius: "2px"
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ── MOBILE FILTERS TOGGLE ─────────────────────────── */}
      <div className="mobile-filters-toggle hidden-desktop">
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          style={{
            width: "100%", padding: "12px", background: "var(--bg2)", border: "1px solid var(--border)",
            color: "var(--text)", fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
          }}
        >
          <span>Filters & Search</span>
          <span>+</span>
        </button>
      </div>

      {/* ── ARTICLES LIST ─────────────────────────────────── */}
      <div className="articles-list">
        {filteredArticles.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--text3)", letterSpacing: ".06em" }}>
              {activeTag || searchQuery
                ? "No articles matched your criteria."
                : "No articles published yet. Ink is drying."}
            </p>
            {(activeTag || searchQuery) && (
              <button
                onClick={() => { setActiveTag(null); setSearchQuery(""); }}
                style={{
                  fontFamily: "var(--mono)", fontSize: "11px", color: "var(--seal)", 
                  textDecoration: "none", background: "none", border: "none",
                  cursor: "pointer", display: "inline-block", marginTop: "16px",
                }}
              >
                ← Clear filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredArticles.map((article, i, arr) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug.split("/").pop()}`}
                style={{ textDecoration: "none" }}
              >
                <article
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "12px",
                    padding: "28px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "all .2s",
                  }}
                  className="article-row-dark"
                >
                  {/* Metadata Row */}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                    <time style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text4)" }}>
                      {formatDate(article.date)}
                    </time>
                    <span style={{ color: "var(--border)" }}>/</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {article.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: ".1em", color: "var(--seal)", textTransform: "uppercase" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {article.readingTime && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text4)", letterSpacing: ".06em", marginLeft: "auto" }}>
                        {article.readingTime} min read
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontStyle: "italic", fontWeight: 400, color: "var(--text)", lineHeight: 1.3, margin: 0 }}>
                    {article.title}
                  </h2>

                  <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.7, margin: 0, maxWidth: "65ch" }}>
                    {article.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* Desktop Layout */
        @media (min-width: 800px) {
          .articles-grid {
            grid-template-columns: 240px 1fr !important;
            gap: 60px !important;
          }
          .hidden-desktop {
            display: none !important;
          }
        }

        /* Mobile Layout */
        @media (max-width: 799px) {
          .filters-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg);
            z-index: 9999;
            padding: 24px;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
          }
          .filters-sidebar.open {
            transform: translateY(0);
          }
          .mobile-filters-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 8px;
          }
          .articles-grid {
            padding: 20px 20px 60px !important;
          }
        }

        .article-row-dark:hover h2 { color: var(--seal) !important; }
        .article-row-dark:hover { background: var(--bg2); padding-left: 16px; padding-right: 16px; margin-left: -16px; margin-right: -16px; }
      `}</style>
    </div>
  );
}
