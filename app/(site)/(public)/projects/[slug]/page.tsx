import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects, urlSlug } from "@/lib/velite";
import { MDXContent } from "@/components/mdx-content";
import { InkDivider } from "@/components/wabi/InkDivider";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: urlSlug(p.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return { title: project.title, description: project.excerpt };
}

const STATUS_COLORS: Record<string, string> = {
  active: "var(--ok)",
  paused: "var(--warn)",
  completed: "var(--teal)",
  experimental: "var(--gold)",
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <article itemScope itemType="https://schema.org/Article">
        <header className="page-section" style={{ paddingBottom: "2rem" }}>
          <div className="section-container" style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
            {/* Status + date */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.1em",
                color: STATUS_COLORS[project.projectStatus] ?? "var(--ghost)",
                border: `1px solid ${STATUS_COLORS[project.projectStatus] ?? "var(--ghost)"}`,
                padding: "0.15rem 0.5rem", textTransform: "uppercase",
              }}>
                {project.projectStatus}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--ink-mid)" }}>
                {new Date(project.date).getFullYear()}
              </span>
            </div>

            <h1 itemProp="headline" style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "1rem" }}>
              {project.title}
            </h1>

            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05rem", color: "var(--ink-mid)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "52ch" }}>
              {project.excerpt}
            </p>

            {/* Tech stack */}
            {project.stack && project.stack.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
                {project.stack.map((tech) => (
                  <span key={tech} style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.06em", color: "var(--teal)", border: "1px solid var(--teal-light)", padding: "0.15rem 0.5rem", background: "var(--teal-light)" }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--ink-faint)", paddingTop: "1rem" }}>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--seal)", letterSpacing: "0.04em", textDecoration: "none" }}>
                  Live ↗
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--ink-mid)", letterSpacing: "0.04em", textDecoration: "none" }}>
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="prose-wabi" style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "1rem 1.25rem 4rem" }} itemProp="articleBody">
          <MDXContent code={project.body} />
        </div>

        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "0 1.25rem 2rem" }}>
          <a href="/projects" style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--ink-mid)", textDecoration: "none" }}>
            ← All projects
          </a>
        </div>
      </article>
    </>
  );
}
