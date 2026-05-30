"use client";

import { useState, useEffect, useRef } from "react";

export function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const sectionRef = useRef<HTMLElement>(null);

  // Haiku reveal: IntersectionObserver on the section itself
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lines = section.querySelectorAll<HTMLElement>(".haiku-line");
    if (!lines.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lines.forEach((line) => {
            line.style.opacity = "1";
            line.style.transform = "translateY(0)";
          });
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function handleSubscribe() {
    if (!email.trim().includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }
    // TODO: wire to a real subscribe server action
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        padding: "100px 40px",
        textAlign: "center",
      }}
    >
      {/* Haiku — starts invisible, revealed by the useEffect observer above */}
      <div style={{ margin: "0 auto 44px", maxWidth: "360px" }}>
        {[
          "Lines of code at dawn —",
          "the machine learns what I built,",
          "I learn what I missed.",
        ].map((line, i) => (
          <span
            key={i}
            className="haiku-line"
            style={{
              fontFamily: "var(--serif)",
              fontSize: "1.25rem",
              fontStyle: "italic",
              color: "var(--text)",
              lineHeight: 1.85,
              display: "block",
              opacity: 0,
              transform: "translateY(10px)",
              transition: `opacity .65s ${i * 0.22}s, transform .65s ${i * 0.22}s`,
              textShadow: "0 1px 2px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            {line}
          </span>
        ))}
      </div>

      <div style={{ width: "24px", height: "1px", background: "var(--border2)", margin: "24px auto" }} />

      <p style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--text)", letterSpacing: ".08em", marginBottom: "28px", textShadow: "0 1px 2px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.5)" }}>
        A periodic dispatch from the lab. Deep work, documented. No noise.
      </p>

      <div
        style={{
          display: "flex",
          maxWidth: "380px",
          margin: "0 auto 12px",
          border: status === "error" ? "1px solid var(--seal)" : "1px solid var(--border)",
          transition: "border-color .2s",
        }}
      >
        <input
          id="nl-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubscribe()}
          placeholder="your@email.com"
          disabled={status === "success"}
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "none",
            background: "var(--bg2)",
            fontFamily: "var(--mono)",
            fontSize: "12px",
            color: "var(--text)",
            outline: "none",
            letterSpacing: ".04em",
          }}
        />
        <button
          id="nl-btn"
          onClick={handleSubscribe}
          disabled={status === "success"}
          style={{
            padding: "12px 20px",
            border: "none",
            background: status === "success" ? "#2d6a1e" : "var(--seal)",
            color: "white",
            fontFamily: "var(--mono)",
            fontSize: "11px",
            letterSpacing: ".1em",
            cursor: status === "success" ? "default" : "pointer",
            transition: "background .25s",
            whiteSpace: "nowrap",
          }}
        >
          {status === "success" ? "Subscribed ✓" : "Subscribe"}
        </button>
      </div>

      <p style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text2)", letterSpacing: ".08em", textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}>
        Arrives occasionally · Unsubscribe anytime
      </p>
    </section>
  );
}
