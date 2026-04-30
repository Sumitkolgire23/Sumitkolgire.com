import type { Metadata } from "next";
import { InkDivider } from "@/components/wabi/InkDivider";
import { BrushTimeline } from "@/components/wabi/BrushTimeline";

export const metadata: Metadata = {
  title: "About — Sumit Kolgire",
  description: "3rd-year engineering student building AI/ML systems. This is who I am, what I care about, and how I think.",
};

const TIMELINE_ITEMS = [
  {
    year: "2024",
    title: "Started NOVELMAN",
    description: "Left a safe path to build a web novel platform with AI at the core. First real product.",
  },
  {
    year: "2024",
    title: "Built Ryuu AI OS",
    description: "Local-first multi-agent AI system. Research tool, second brain, and my daily coding co-pilot.",
  },
  {
    year: "2023",
    title: "Fell into AI/ML",
    description: "Read the Transformer paper. Couldn't stop. Started building with models before I fully understood them.",
  },
  {
    year: "2022",
    title: "Started Engineering",
    description: "First year. Realised I learn by building, not by studying. Set up the first home lab.",
  },
];

const OBSESSIONS = [
  { label: "Multi-agent systems", note: "Does emergent intent exist at scale?" },
  { label: "RAG & knowledge systems", note: "Making LLMs know what they don't know." },
  { label: "Product architecture", note: "Where systems thinking meets user behaviour." },
  { label: "Wabi-Sabi in design", note: "Imperfection as an intentional aesthetic." },
  { label: "Stoic philosophy", note: "Obstacle is the way. Every time." },
];

export default function AboutPage() {
  return (
    <>
      {/* ── BIO ─────────────────────────────────────────── */}
      <section className="page-section" style={{ paddingBottom: "2rem" }}>
        <div className="section-container" style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            About
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "1.25rem", lineHeight: 1.15 }}>
            Sumit Kolgire
          </h1>

          <div style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", color: "var(--ink)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "1.2em" }}>
            <p>
              3rd-year engineering student. I build AI/ML systems, write about how they work, and document the entire process — including the parts where I'm wrong.
            </p>
            <p>
              I'm interested in the space between <em>research</em> and <em>product</em> — where theory gets stress-tested by real users, real constraints, and real failure modes. That's where the interesting problems live.
            </p>
            <p>
              This site is a lab notebook, not a portfolio. A portfolio shows the good stuff. A lab notebook shows the thinking.
            </p>
          </div>

          {/* Currently building */}
          <div style={{ marginTop: "2.5rem", padding: "1.25rem", border: "1px solid var(--ink-faint)", background: "var(--paper-2)" }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Currently Building
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { name: "NOVELMAN", desc: "Web novel platform — AI author co-pilot" },
                { name: "Ryuu AI OS", desc: "Local multi-agent research system" },
                { name: "This site", desc: "Public lab + private research journal" },
              ].map((p) => (
                <div key={p.name} style={{ display: "flex", gap: "1rem", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", fontWeight: 600, color: "var(--ink)", minWidth: "120px" }}>
                    {p.name}
                  </span>
                  <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "0.875rem", color: "var(--ink-mid)" }}>
                    {p.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InkDivider />

      {/* ── OBSESSIONS ───────────────────────────────────── */}
      <section className="page-section" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="section-container" style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)", marginBottom: "1.5rem" }}>
            Current Obsessions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {OBSESSIONS.map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", padding: "0.85rem 0", borderBottom: "1px solid var(--ink-faint)" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: "0.95rem", fontWeight: 600, color: "var(--ink)" }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "0.875rem", color: "var(--ink-mid)" }}>
                  {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InkDivider />

      {/* ── TIMELINE ─────────────────────────────────────── */}
      <section className="page-section" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="section-container" style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)", marginBottom: "2rem" }}>
            The Path So Far
          </h2>
          <BrushTimeline items={TIMELINE_ITEMS} />
        </div>
      </section>

      <InkDivider />

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section className="page-section" style={{ paddingTop: "2rem" }}>
        <div className="section-container" style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)", marginBottom: "1.25rem" }}>
            Get in Touch
          </h2>
          <p style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--ink-mid)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "46ch" }}>
            I'm open to interesting conversations, collaboration on AI/ML research, and consulting. Not open to cold outreach trying to sell me something.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { label: "Twitter / X", href: "https://twitter.com/sumitkolgire" },
              { label: "GitHub", href: "https://github.com/sumitkolgire" },
              { label: "LinkedIn", href: "https://linkedin.com/in/sumitkolgire" },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", letterSpacing: "0.04em", color: "var(--seal)", textDecoration: "none" }}>
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
