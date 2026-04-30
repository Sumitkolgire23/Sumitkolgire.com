"use client";

import { useState } from "react";

export function HaikuNewsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ maxWidth: "480px" }}>
      {/* Three-line haiku label */}
      <p
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: "0.95rem",
          color: "var(--ink-mid)",
          lineHeight: 1.9,
          marginBottom: "1.25rem",
        }}
      >
        One essay, sometimes.
        <br />
        When something feels worth keeping.
        <br />
        No noise. Just signal.
      </p>

      {state === "success" ? (
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.8rem",
            color: "var(--moss)",
            letterSpacing: "0.05em",
          }}
        >
          [SUBSCRIBED] — you&apos;ll hear from me when it matters.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{
              flex: 1,
              fontFamily: "var(--mono)",
              fontSize: "0.85rem",
              padding: "0.6rem 0.85rem",
              border: "1px solid var(--ink-faint)",
              background: "var(--paper)",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={state === "loading"}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              padding: "0.6rem 1rem",
              background: "var(--ink)",
              color: "var(--paper)",
              border: "none",
              cursor: state === "loading" ? "wait" : "pointer",
              transition: "opacity 0.15s",
              opacity: state === "loading" ? 0.6 : 1,
            }}
          >
            {state === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {state === "error" && (
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.75rem",
            color: "var(--seal)",
            marginTop: "0.5rem",
          }}
        >
          Something went wrong — try again.
        </p>
      )}
    </div>
  );
}
