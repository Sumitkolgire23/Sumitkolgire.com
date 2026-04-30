import type { Metadata } from "next";
import { getProjects } from "@/lib/velite";
import { OffsetShadowCard } from "@/components/wabi/OffsetShadowCard";
import { InkDivider } from "@/components/wabi/InkDivider";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies of the things Sumit Kolgire has built — architecture decisions, trade-offs, and lessons learned.",
};

const STATUS_COLORS: Record<string, string> = {
  active: "var(--ok)",
  paused: "var(--warn)",
  completed: "var(--teal)",
  experimental: "var(--gold)",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <section className="page-section" style={{ paddingBottom: "2rem" }}>
        <div className="section-container">
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--ink-mid)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Projects
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.75rem", lineHeight: 1.15 }}>
            Things I've Built
          </h1>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1rem", color: "var(--ink-mid)", maxWidth: "52ch", lineHeight: 1.7 }}>
            Not a list of GitHub repos. Case studies — what I was thinking, what broke, and what I learned.
          </p>
        </div>
      </section>

      <InkDivider />

      <section className="page-section" style={{ paddingTop: "2rem" }}>
        <div className="section-container">
          {projects.length === 0 ? (
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", color: "var(--ink-mid)" }}>
              Case studies loading…
            </p>
          ) : (
            <div className="grid-responsive-2" style={{ gap: "1.5rem" }}>
              {projects.map((project) => (
                <OffsetShadowCard key={project.slug} href={`/projects/${project.slug.split("/").pop()}`}>
                  {/* Status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.1em",
                      color: STATUS_COLORS[project.projectStatus] ?? "var(--ghost)",
                      textTransform: "uppercase",
                      border: `1px solid ${STATUS_COLORS[project.projectStatus] ?? "var(--ghost)"}`,
                      padding: "0.1rem 0.45rem",
                    }}>
                      {project.projectStatus}
                    </span>
                  </div>

                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1rem, 2.5vw, 1.15rem)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                    {project.title}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", lineHeight: 1.65, marginBottom: "1rem" }}>
                    {project.excerpt}
                  </p>

                  {/* Tech stack tags */}
                  {project.stack && project.stack.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {project.stack.slice(0, 5).map((tech) => (
                        <span key={tech} style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "0.06em", color: "var(--teal)", border: "1px solid var(--teal-light)", padding: "0.1rem 0.4rem", background: "var(--teal-light)" }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </OffsetShadowCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
