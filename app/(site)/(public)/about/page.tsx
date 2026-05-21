import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Sumit Kolgire",
  description:
    "3rd-year AI/ML engineering student. Building NOVELMAN, Ryuu AI OS, and this site. This is who I am, what I care about, and how I think.",
};

const TIMELINE = [
  {
    year: "2025",
    title: "Building in public",
    description:
      "Launched this lab. Started writing consistently. Moved all research into a structured system.",
  },
  {
    year: "2024",
    title: "Started NOVELMAN",
    description:
      "Left a safe path to build a web novel platform with AI at the core. First real product. First real failure. First real lesson.",
  },
  {
    year: "2024",
    title: "Built Ryuu AI OS",
    description:
      "Local-first multi-agent AI system. Research tool, second brain, and my daily coding co-pilot.",
  },
  {
    year: "2023",
    title: "Fell into AI/ML",
    description:
      "Read the Transformer paper. Couldn't stop. Started building with models before I fully understood them.",
  },
  {
    year: "2022",
    title: "Started Engineering",
    description:
      "First year. Realised I learn by building, not by studying. Set up the first home lab.",
  },
];

const OBSESSIONS = [
  { label: "Multi-agent systems",     note: "Does emergent intent exist at scale?" },
  { label: "RAG & knowledge systems", note: "Making LLMs know what they don't know." },
  { label: "Product architecture",    note: "Where systems thinking meets user behaviour." },
  { label: "Stoic philosophy",        note: "Obstacle is the way. Every time." },
  { label: "Japanese language",       note: "JLPT N5 prep — patience as practice." },
];

const CURRENTLY = [
  { label: "Reading",   value: "Gödel, Escher, Bach — Hofstadter" },
  { label: "Building",  value: "Multi-agent state serialization (Ryuu v3)" },
  { label: "Learning",  value: "Japanese · JLPT N5" },
  { label: "Watching",  value: "Lex Fridman #400 — Consciousness" },
];

const SOCIAL = [
  { label: "Twitter / X", href: "https://twitter.com/sumitkolgire" },
  { label: "GitHub",      href: "https://github.com/sumitkolgire" },
  { label: "LinkedIn",    href: "https://linkedin.com/in/sumitkolgire" },
];

export default function AboutPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "80px 40px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* background letter */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", top: 0, right: "40px",
            fontFamily: "var(--serif)", fontSize: "220px", fontStyle: "italic",
            color: "rgba(255,255,255,.018)", lineHeight: 1, pointerEvents: "none",
            userSelect: "none",
          }}
        >
          A
        </div>

        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto", position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)",
              letterSpacing: ".2em", textTransform: "uppercase", marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "10px",
            }}
          >
            <span style={{ display: "inline-block", width: "16px", height: "1px", background: "var(--seal)" }} />
            About
          </div>

          <h1
            style={{
              fontFamily: "var(--serif)", fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              fontStyle: "italic", fontWeight: 400, color: "var(--text)",
              lineHeight: 1.1, marginBottom: "28px",
            }}
          >
            Sumit Kolgire
          </h1>

          <div
            style={{
              maxWidth: "600px", display: "flex", flexDirection: "column",
              gap: "1.2em", fontSize: "16px", color: "var(--text2)", lineHeight: 1.88,
            }}
          >
            <p>
              3rd-year engineering student (B.E. AI/ML, 2023–2027). I build
              intelligent systems, write about how they work, and document the
              entire process — including the parts where I&apos;m wrong.
            </p>
            <p>
              I&apos;m interested in the space between <em>research</em> and{" "}
              <em>product</em> — where theory gets stress-tested by real users,
              real constraints, and real failure modes. That&apos;s where the
              interesting problems live.
            </p>
            <p>
              This site is a lab notebook, not a portfolio. A portfolio shows the
              good stuff. A lab notebook shows the thinking.
            </p>
          </div>
        </div>
      </section>

      {/* ── CURRENTLY ─────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "60px 40px",
          background: "var(--bg2)",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

            {/* Left: currently building */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--serif)", fontSize: "1.5rem", fontStyle: "italic",
                  fontWeight: 400, color: "var(--text)", marginBottom: "28px",
                }}
              >
                Currently building
              </h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { name: "NOVELMAN",     desc: "Web novel platform — AI author co-pilot" },
                  { name: "Ryuu AI OS",   desc: "Local multi-agent research system" },
                  { name: "This site",    desc: "Public lab + private research journal" },
                ].map((p, i, arr) => (
                  <div
                    key={p.name}
                    style={{
                      display: "grid", gridTemplateColumns: "130px 1fr", gap: "16px",
                      alignItems: "baseline", padding: "14px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600,
                        color: "var(--text)", letterSpacing: ".04em",
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--serif)", fontStyle: "italic",
                        fontSize: "14px", color: "var(--text2)",
                      }}
                    >
                      {p.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: currently reading/watching etc */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--serif)", fontSize: "1.5rem", fontStyle: "italic",
                  fontWeight: 400, color: "var(--text)", marginBottom: "28px",
                }}
              >
                Currently
              </h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {CURRENTLY.map((item, i, arr) => (
                  <div
                    key={item.label}
                    style={{
                      display: "grid", gridTemplateColumns: "90px 1fr", gap: "12px",
                      padding: "12px 0", alignItems: "baseline",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)",
                        letterSpacing: ".1em", textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{ fontSize: "14px", color: "var(--text2)", fontStyle: "italic" }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OBSESSIONS ───────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "60px 40px",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--serif)", fontSize: "1.5rem", fontStyle: "italic",
              fontWeight: 400, color: "var(--text)", marginBottom: "36px",
            }}
          >
            Current Obsessions
          </h2>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {OBSESSIONS.map((item, i, arr) => (
              <div
                key={item.label}
                style={{
                  display: "flex", justifyContent: "space-between", flexWrap: "wrap",
                  gap: "12px", padding: "18px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: "15px", fontWeight: 500, color: "var(--text)",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--serif)", fontStyle: "italic",
                    fontSize: "14px", color: "var(--text3)",
                  }}
                >
                  {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "60px 40px",
          background: "var(--bg2)",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--serif)", fontSize: "1.5rem", fontStyle: "italic",
              fontWeight: 400, color: "var(--text)", marginBottom: "48px",
            }}
          >
            The Path So Far
          </h2>

          <div style={{ position: "relative", paddingLeft: "24px", borderLeft: "1px solid var(--border)" }}>
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                style={{
                  position: "relative", paddingBottom: i < TIMELINE.length - 1 ? "40px" : "0",
                }}
              >
                {/* dot */}
                <div
                  style={{
                    position: "absolute", left: "-32px", top: "4px",
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: i === 0 ? "var(--seal)" : "var(--border3)",
                    border: `1px solid ${i === 0 ? "var(--seal)" : "var(--border2)"}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)",
                    letterSpacing: ".12em", marginBottom: "6px",
                  }}
                >
                  {item.year}
                </div>
                <div
                  style={{
                    fontSize: "15px", fontWeight: 500, color: "var(--text)",
                    marginBottom: "6px",
                  }}
                >
                  {item.title}
                </div>
                <p
                  style={{
                    fontSize: "14px", color: "var(--text2)", lineHeight: 1.72, margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────── */}
      <section style={{ padding: "60px 40px" }}>
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--serif)", fontSize: "1.5rem", fontStyle: "italic",
              fontWeight: 400, color: "var(--text)", marginBottom: "16px",
            }}
          >
            Get in Touch
          </h2>
          <p
            style={{
              fontSize: "15px", color: "var(--text2)", lineHeight: 1.8,
              marginBottom: "32px", maxWidth: "48ch",
            }}
          >
            Open to interesting conversations, collaboration on AI/ML research,
            and consulting. Not open to cold outreach trying to sell me something.
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {SOCIAL.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="about-social-link"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
