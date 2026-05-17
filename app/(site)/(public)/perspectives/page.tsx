import type { Metadata } from "next";
import Link from "next/link";
import { getPerspectives } from "@/lib/velite";
import { OffsetShadowCard } from "@/components/wabi/OffsetShadowCard";
import { InkDivider } from "@/components/wabi/InkDivider";

export const metadata: Metadata = {
  title: "Perspectives",
  description:
    "Short, opinionated stances on AI, building, and the world. Positions I'm willing to defend.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PerspectivesPage() {
  const povs = getPerspectives();

  return (
    <>
      <section className="page-section" style={{ paddingBottom: "2rem" }}>
        <div className="section-container">
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Perspectives
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.75rem", lineHeight: 1.15 }}>
            Positions & POVs
          </h1>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1rem", color: "var(--ink-mid)", maxWidth: "52ch", lineHeight: 1.7 }}>
            Shorter than essays. More opinionated. A position I'm willing to defend — and sometimes revise.
          </p>
        </div>
      </section>

      <InkDivider />

      <section className="page-section" style={{ paddingTop: "2rem" }}>
        <div className="section-container">
          {povs.length === 0 ? (
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", color: "var(--ink-mid)" }}>
              No perspectives published yet. Still forming.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {povs.map((pov) => (
                <OffsetShadowCard key={pov.slug} href={`/perspectives/${pov.slug.split("/").pop()}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.6rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {pov.contested && (
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.08em", color: "var(--seal)", border: "1px solid var(--seal)", padding: "0.1rem 0.4rem" }}>
                          CONTESTED
                        </span>
                      )}
                      {pov.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.08em", color: "var(--ink-mid)", textTransform: "uppercase" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <time style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--ink-mid)" }}>
                      {formatDate(pov.date)}
                    </time>
                  </div>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.4rem", lineHeight: 1.3 }}>
                    {pov.title}
                  </h2>
                  <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "0.9rem", color: "var(--seal)", marginBottom: "0.5rem", lineHeight: 1.5 }}>
                    "{pov.stance}"
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", lineHeight: 1.65, margin: 0 }}>
                    {pov.excerpt}
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
