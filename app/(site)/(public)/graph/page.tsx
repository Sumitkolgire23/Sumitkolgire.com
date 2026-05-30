import type { Metadata } from "next";
import { KnowledgeGraphWrapper } from "@/components/wabi/KnowledgeGraphWrapper";

export const metadata: Metadata = {
  title: "Knowledge Graph — Digital Brain Map",
  description:
    "An interactive force-directed graph mapping the connections between articles, perspectives, projects, docs, and tags in Sumit's digital brain lab.",
};

export default function GraphPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "60px 40px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background letter */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: "40px",
            fontFamily: "var(--serif)",
            fontSize: "220px",
            fontStyle: "italic",
            color: "rgba(255,255,255,.018)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          G
        </div>

        <div style={{ maxWidth: "var(--site-width)", margin: "0 auto", position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              color: "var(--text3)",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ display: "inline-block", width: "16px", height: "1px", background: "var(--seal)" }} />
            Graph System
          </div>

          <h1
            id="graph-title"
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: "14px",
            }}
          >
            Knowledge Graph
          </h1>

          <p
            style={{
              maxWidth: "64ch",
              fontSize: "14px",
              color: "var(--text2)",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            An interactive force-directed map of my notes, articles, perspectives, and project connections. 
            Drag nodes to pin them, search key concepts, and hover to highlight semantic relationships.
          </p>

          {/* D3 Graph rendering container */}
          <div id="graph-container" style={{ width: "100%" }}>
            <KnowledgeGraphWrapper />
          </div>
        </div>
      </section>
    </main>
  );
}
