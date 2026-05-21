import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Sumit Kolgire",
  description: "This page doesn't exist. Navigate back to the home or explore articles.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "4rem 2rem",
        textAlign: "center",
        gap: "1.5rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--mono)",
          fontSize: "0.8rem",
          color: "var(--text3)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          color: "var(--text)",
          fontWeight: 400,
          lineHeight: 1.2,
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          color: "var(--text3)",
          maxWidth: "38ch",
          lineHeight: 1.7,
          fontSize: "1rem",
        }}
      >
        This page doesn&apos;t exist, or maybe it was moved. The lab is always
        growing — things shift.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            padding: "0.55rem 1.4rem",
            background: "var(--bg3)",
            border: "1px solid var(--border2)",
            borderRadius: "6px",
            color: "var(--text2)",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontFamily: "var(--mono)",
          }}
        >
          ← Home
        </Link>
        <Link
          href="/articles"
          style={{
            padding: "0.55rem 1.4rem",
            background: "var(--seal)",
            borderRadius: "6px",
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontFamily: "var(--mono)",
          }}
        >
          Browse articles
        </Link>
      </div>
    </section>
  );
}
