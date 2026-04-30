"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import "@/app/lab.css";

/* Vertical strings of Kanji to drift upwards */
const KANJI_STRINGS = [
  "静研書思道",
  "学心墨禅詩",
  "究知慧観悟",
  "理論考創志",
  "智録筆夢真"
];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="login-shell">

      {/* ── Left dark ink panel with animated Kanji ── */}
      <div className="login-brand-panel">

        {/* Animated Kanji Background */}
        <div className="kanji-bg-wrapper">
          {KANJI_STRINGS.map((str, i) => (
            <div key={i} className="kanji-column">
              {str}
            </div>
          ))}
        </div>

        {/* Content (Z-indexed above Kanji) */}
        <div style={{ position: "relative", zIndex: 10 }}>

          <div className="login-stamp">
            研
          </div>

          <h1 style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "var(--paper)",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
            marginBottom: "0.5rem",
          }}>
            研究室
          </h1>
          
          <p style={{
            fontFamily: "var(--mono)",
            fontSize: "0.75rem",
            color: "rgba(247,243,236,0.5)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}>
            The Private Lab
          </p>

          <div style={{
            width: 40,
            height: 2,
            background: "var(--seal)",
            marginBottom: "2rem",
            opacity: 0.8,
          }} />

          <p style={{
            fontFamily: "var(--serif)",
            fontSize: "0.95rem",
            color: "rgba(247,243,236,0.6)",
            lineHeight: 1.8,
            maxWidth: 320,
            fontStyle: "italic",
          }}>
            "The master in the art of living makes little distinction between his work and his play."
          </p>
        </div>

        {/* Wabi-Sabi corner text */}
        <div style={{
          position: "absolute",
          bottom: "3rem",
          left: "6rem",
          fontFamily: "var(--mono)",
          fontSize: "0.6rem",
          color: "rgba(247,243,236,0.2)",
          letterSpacing: "0.15em",
          zIndex: 10,
        }}>
          侘び寂び — WABI-SABI
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-form-panel">
        <div style={{ width: "100%", maxWidth: "360px" }}>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "3rem"
          }}>
            <div style={{ width: 24, height: 1, background: "var(--ghost)" }} />
            <span style={{
              fontFamily: "var(--mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ghost)"
            }}>
              Lab Access
            </span>
          </div>

          <form action={formAction}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="email" style={{
                display: "block",
                fontFamily: "var(--mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem"
              }}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={pending}
                autoComplete="email"
                placeholder="author@sumitkolgire.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 0",
                  fontFamily: "var(--mono)",
                  fontSize: "0.9rem",
                  color: "var(--ink)",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--ink-faint)",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderBottomColor = "var(--seal)"}
                onBlur={(e) => e.target.style.borderBottomColor = "var(--ink-faint)"}
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label htmlFor="password" style={{
                display: "block",
                fontFamily: "var(--mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem"
              }}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={pending}
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.75rem 0",
                  fontFamily: "var(--mono)",
                  fontSize: "0.9rem",
                  color: "var(--ink)",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--ink-faint)",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderBottomColor = "var(--seal)"}
                onBlur={(e) => e.target.style.borderBottomColor = "var(--ink-faint)"}
              />
            </div>

            {state?.error && (
              <p style={{
                fontFamily: "var(--mono)",
                fontSize: "0.7rem",
                color: "var(--danger)",
                marginBottom: "1rem"
              }}>⚠ {state.error}</p>
            )}

            <button type="submit" disabled={pending} style={{
              width: "100%",
              padding: "1rem",
              background: "var(--ink)",
              color: "var(--paper)",
              fontFamily: "var(--mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "none",
              cursor: pending ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              opacity: pending ? 0.7 : 1
            }}>
              {pending ? "Authenticating…" : "Enter the Lab"}
            </button>
          </form>

          <a href="/" style={{
            display: "block",
            textAlign: "center",
            marginTop: "3rem",
            fontFamily: "var(--mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            color: "var(--ghost)",
            textDecoration: "none",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--ghost)"}
          >
            ← Back to public site
          </a>
        </div>
      </div>
    </div>
  );
}
