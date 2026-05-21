"use client";

import { useEffect } from "react";

/**
 * Global error boundary — catches unhandled errors in the React tree.
 * Displayed instead of a raw white crash page in production.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: send to Sentry or similar when error monitoring is wired
    console.error("[GlobalError]", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#0d0d0e",
          color: "#f8f5f0",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1.5rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem" }}>⚠</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#c41e3a" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#a8a49e", maxWidth: "40ch", lineHeight: 1.6 }}>
          An unexpected error occurred. If this keeps happening, please reach
          out.
          {error.digest && (
            <span
              style={{
                display: "block",
                marginTop: "0.5rem",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "#706c68",
              }}
            >
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.6rem 1.5rem",
            background: "#c41e3a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{ color: "#a8a49e", fontSize: "0.85rem", textDecoration: "underline" }}
        >
          ← Back to home
        </a>
      </body>
    </html>
  );
}
