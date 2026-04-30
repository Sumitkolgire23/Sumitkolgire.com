interface BrushTimelineItem {
  year: string;
  title: string;
  description: string;
}

interface BrushTimelineProps {
  items: BrushTimelineItem[];
}

export function BrushTimeline({ items }: BrushTimelineProps) {
  return (
    <div style={{ position: "relative", paddingLeft: "2rem" }}>
      {/* Vertical ink line */}
      <div
        style={{
          position: "absolute",
          left: "0.45rem",
          top: 0,
          bottom: 0,
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent, var(--ink) 10%, var(--ink) 90%, transparent)",
          opacity: 0.2,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{ position: "relative" }}>
            {/* Ink dot marker */}
            <div
              style={{
                position: "absolute",
                left: "-1.65rem",
                top: "0.35rem",
                width: "0.55rem",
                height: "0.55rem",
                borderRadius: "50%",
                background: "var(--seal)",
                boxShadow: "0 0 0 3px var(--paper)",
              }}
            />
            <time
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.7rem",
                color: "var(--ink-mid)",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: "0.2rem",
              }}
            >
              {item.year}
            </time>
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
                color: "var(--ink)",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ink-mid)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
