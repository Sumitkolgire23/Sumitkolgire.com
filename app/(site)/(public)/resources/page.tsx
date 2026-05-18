import type { Metadata } from "next";
import { getPublicResources } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Resources — Sumit Kolgire",
  description:
    "Curated books, papers, tools, and links. Every link has a reason for being here.",
};

const DOMAIN_COLORS: Record<string, string> = {
  AI: "var(--teal)",
  ML: "var(--teal)",
  Research: "var(--warn)",
  Systems: "var(--gold)",
  Philosophy: "var(--seal)",
  Tools: "var(--ok)",
  Web: "var(--ink-mid)",
  Design: "var(--seal)",
};

// ── Fallback seed data (shown when DB is empty) ────────────────────────────
const SEED_RESOURCES = [
  {
    id: "seed-1",
    domain: "AI",
    title: "Attention Is All You Need",
    url: "https://arxiv.org/abs/1706.03762",
    note: "The Transformer paper. Still the most important ML paper of the decade.",
    type: "paper",
    created_at: "",
  },
  {
    id: "seed-2",
    domain: "Systems",
    title: "Designing Data-Intensive Applications",
    url: "https://dataintensive.net/",
    note: "Martin Kleppmann's masterclass. Read this before touching any distributed system.",
    type: "book",
    created_at: "",
  },
  {
    id: "seed-3",
    domain: "Philosophy",
    title: "The Courage to Be Disliked",
    url: "https://www.goodreads.com/book/show/43306206",
    note: "Adlerian philosophy as dialogue. Changed how I think about purpose vs. approval.",
    type: "book",
    created_at: "",
  },
  {
    id: "seed-4",
    domain: "Tools",
    title: "Obsidian",
    url: "https://obsidian.md",
    note: "My second brain. The only note-taking tool that gets out of the way.",
    type: "tool",
    created_at: "",
  },
  {
    id: "seed-5",
    domain: "Research",
    title: "LLM Agents Survey (2024)",
    url: "https://arxiv.org/abs/2308.11432",
    note: "Best survey on autonomous LLM agents. My reference for Ryuu AI OS architecture.",
    type: "paper",
    created_at: "",
  },
  {
    id: "seed-6",
    domain: "Web",
    title: "Josh W Comeau's CSS blog",
    url: "https://www.joshwcomeau.com",
    note: "The best CSS explanations on the internet. Visualises concepts nobody else bothers to.",
    type: "link",
    created_at: "",
  },
];

type Resource = {
  id: string;
  title: string;
  url: string;
  note: string | null;
  domain: string | null;
  type: string | null;
  created_at: string;
};

function groupByDomain(items: Resource[]) {
  return items.reduce<Record<string, Resource[]>>((acc, item) => {
    const key = item.domain ?? "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export default async function ResourcesPage() {
  let resources = await getPublicResources();

  // Fall back to seed data if DB is empty
  if (!resources.length) {
    resources = SEED_RESOURCES;
  }

  const grouped = groupByDomain(resources);
  const domains = Object.keys(grouped).sort();

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
            Resources
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)", fontSize: "clamp(2rem, 4vw, 3rem)",
              fontStyle: "italic", fontWeight: 400, color: "var(--text)",
              lineHeight: 1.1, marginBottom: "16px",
            }}
          >
            The Curated Library
          </h1>
          <p
            style={{
              fontSize: "15px", color: "var(--text2)", lineHeight: 1.75,
              maxWidth: "50ch", fontStyle: "italic",
            }}
          >
            Books, papers, tools, and links that shaped how I think.
            Every link has a reason for being here.
          </p>
        </div>
      </section>

      {/* ── RESOURCE GROUPS ─────────────────────────────────── */}
      <section
        style={{
          maxWidth: "var(--site-width)",
          margin: "0 auto",
          padding: "60px 40px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "60px",
        }}
      >
        {domains.map((domain) => (
          <div key={domain}>
            {/* Domain heading */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: DOMAIN_COLORS[domain] ?? "var(--text3)",
                  border: `1px solid ${DOMAIN_COLORS[domain] ?? "var(--border)"}`,
                  padding: "3px 8px",
                }}
              >
                {domain}
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>

            {/* Resource rows */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {grouped[domain].map((resource, i, arr) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "16px",
                    alignItems: "start",
                    padding: "20px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    textDecoration: "none",
                    transition: "padding-left .15s",
                  }}
                  className="resource-row"
                >
                  <div>
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        marginBottom: "6px", flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--serif)", fontSize: "1rem",
                          fontWeight: 500, color: "var(--text)", lineHeight: 1.3,
                        }}
                      >
                        {resource.title}
                      </span>
                      {resource.type && (
                        <span
                          style={{
                            fontFamily: "var(--mono)", fontSize: "8px",
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: "var(--text4)", border: "1px solid var(--border)",
                            padding: "1px 5px",
                          }}
                        >
                          {resource.type}
                        </span>
                      )}
                    </div>
                    {resource.note && (
                      <p
                        style={{
                          fontFamily: "var(--serif)", fontStyle: "italic",
                          fontSize: "13px", color: "var(--text2)",
                          lineHeight: 1.65, margin: 0, maxWidth: "60ch",
                        }}
                      >
                        {resource.note}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--mono)", fontSize: "12px",
                      color: "var(--text4)", paddingTop: "2px",
                      transition: "color .15s",
                    }}
                    className="resource-arrow"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <style>{`
        .resource-row:hover { padding-left: 12px; background: var(--bg2); margin-left: -12px; padding-right: 12px; }
        .resource-row:hover .resource-arrow { color: var(--seal) !important; }

        @media (max-width: 640px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </main>
  );
}
