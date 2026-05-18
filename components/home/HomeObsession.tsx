export function HomeObsession() {
  return (
    <section
      id="obsession"
      className="page-section"
      style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)" }}
    >
      <div className="section-container">
        <div
          className="reveal"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}
        >
          {/* Left: essay */}
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "9px",
                color: "var(--text3)",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ display: "inline-block", width: "16px", height: "1px", background: "var(--seal)" }} />
              Currently thinking about
            </div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.7rem, 3vw, 2.8rem)",
                fontStyle: "italic",
                lineHeight: 1.18,
                color: "var(--text)",
                marginBottom: "18px",
                fontWeight: 400,
              }}
            >
              The architecture of consciousness and what it means for machines that simulate it
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text2)", lineHeight: 1.88 }}>
              Not as a philosophical exercise — as an engineering constraint. If we build
              systems that model their own state, what failure modes emerge? What does a
              &quot;strange loop&quot; look like in a production agent system? These questions
              shape everything I&apos;m building right now.
            </p>
          </div>

          {/* Right: currently list */}
          <div>
            <span
              style={{
                fontFamily: "var(--serif)",
                fontSize: "9rem",
                fontStyle: "italic",
                color: "rgba(255,255,255,.025)",
                lineHeight: 1,
                marginBottom: "28px",
                display: "block",
                letterSpacing: "-.05em",
              }}
            >
              S
            </span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Reading",   value: "Gödel, Escher, Bach — Hofstadter" },
                { label: "Building",  value: "Multi-agent state serialization" },
                { label: "Learning",  value: "Japanese — JLPT N5 prep" },
                { label: "Listening", value: "Lex Fridman #400 — Consciousness" },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</span>
                  <span style={{ fontSize: "14px", color: "var(--text2)", fontStyle: "italic" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #obsession .obs-inner { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}
