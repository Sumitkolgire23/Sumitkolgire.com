import type { Metadata } from "next";
import { InkDivider } from "@/components/wabi/InkDivider";

export const metadata: Metadata = {
  title: "Resources",
  description: "Sumit Kolgire's curated reading list — books, papers, tools, and links. Every link has a reason for being here.",
};

// ── Seed data for Phase 1 (will be replaced with DB in Phase 2) ──────────────
const SEED_RESOURCES = [
  {
    id: "1",
    domain: "AI",
    title: "Attention Is All You Need",
    url: "https://arxiv.org/abs/1706.03762",
    note: "The Transformer paper. Still the most important ML paper of the decade.",
  },
  {
    id: "2",
    domain: "Systems",
    title: "Designing Data-Intensive Applications",
    url: "https://dataintensive.net/",
    note: "Martin Kleppmann's masterclass. Read this before touching any distributed system.",
  },
  {
    id: "3",
    domain: "Philosophy",
    title: "The Courage to Be Disliked",
    url: "https://www.goodreads.com/book/show/43306206",
    note: "Adlerian philosophy as dialogue. Changed how I think about purpose vs. approval.",
  },
  {
    id: "4",
    domain: "Tools",
    title: "Obsidian",
    url: "https://obsidian.md",
    note: "My second brain. The only note-taking tool that gets out of the way.",
  },
  {
    id: "5",
    domain: "Research",
    title: "LLM Agents Survey (2024)",
    url: "https://arxiv.org/abs/2308.11432",
    note: "Best survey on autonomous LLM agents. My reference for Ryuu AI OS architecture.",
  },
  {
    id: "6",
    domain: "Web",
    title: "Josh W Comeau's CSS blog",
    url: "https://www.joshwcomeau.com",
    note: "The best CSS explanations on the internet. Visualizes concepts nobody else bothers to.",
  },
];

const DOMAIN_COLORS: Record<string, string> = {
  AI: "var(--teal)",
  ML: "var(--teal)",
  Systems: "var(--gold)",
  Philosophy: "var(--seal)",
  Tools: "var(--ok)",
  Web: "var(--ink-mid)",
  Research: "var(--warn)",
};

// Group by domain
function groupByDomain(items: typeof SEED_RESOURCES) {
  return items.reduce<Record<string, typeof SEED_RESOURCES>>((acc, item) => {
    if (!acc[item.domain]) acc[item.domain] = [];
    acc[item.domain].push(item);
    return acc;
  }, {});
}

export default function ResourcesPage() {
  const grouped = groupByDomain(SEED_RESOURCES);
  const domains = Object.keys(grouped).sort();

  return (
    <>
      <section className="page-section" style={{ paddingBottom: "2rem" }}>
        <div className="section-container">
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Resources
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.75rem", lineHeight: 1.15 }}>
            The Curated Library
          </h1>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1rem", color: "var(--ink-mid)", maxWidth: "52ch", lineHeight: 1.7 }}>
            Books, papers, tools, and links that shaped how I think. Every link has a reason for being here.
          </p>
        </div>
      </section>

      <InkDivider />

      <section className="page-section" style={{ paddingTop: "2rem" }}>
        <div className="section-container">
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {domains.map((domain) => (
              <div key={domain}>
                {/* Domain heading */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.12em",
                    textTransform: "uppercase", color: DOMAIN_COLORS[domain] ?? "var(--ink-mid)",
                    border: `1px solid ${DOMAIN_COLORS[domain] ?? "var(--ink-faint)"}`,
                    padding: "0.15rem 0.55rem",
                  }}>
                    {domain}
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "var(--ink-faint)" }} />
                </div>

                {/* Resource list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {grouped[domain].map((resource, i) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        padding: "1rem 0",
                        borderBottom: "1px solid var(--ink-faint)",
                        textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
                        <span style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>
                          {resource.title}
                        </span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--ink-mid)" }}>
                          ↗
                        </span>
                      </div>
                      <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "0.875rem", color: "var(--ink-mid)", lineHeight: 1.6, margin: "0.35rem 0 0" }}>
                        {resource.note}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
