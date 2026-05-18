"use client";

const TICKER_ITEMS = [
  "Multi-Agent Systems",
  "Brain-Computer Interfaces",
  "Intelligent Automation",
  "System Design",
  "Deep Learning",
  "NOVELMAN · GrowthMate · Ryuu AI OS",
  "LangChain · PyTorch · FastAPI",
  "Research & Experimentation",
];

export function HomeTicker() {
  // Duplicate items for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "9px 0",
        background: "var(--bg2)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "ticker 32s linear infinite",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "10px",
              color: "var(--text3)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              padding: "0 36px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "var(--seal)", fontSize: "8px" }}>—</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
