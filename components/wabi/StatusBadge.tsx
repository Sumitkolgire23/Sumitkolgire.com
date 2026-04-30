interface StatusBadgeProps {
  status: "active" | "building" | "completed" | "experimental" | "paused" | string;
  className?: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active:       { label: "ACTIVE",       color: "var(--cyan)"   },
  building:     { label: "BUILDING",     color: "var(--seal)"   },
  completed:    { label: "COMPLETED",    color: "var(--moss)"   },
  experimental: { label: "EXPERIMENTAL", color: "var(--gold)"   },
  paused:       { label: "PAUSED",       color: "var(--ink-mid)"},
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const entry = STATUS_MAP[status] ?? { label: status.toUpperCase(), color: "var(--ink-mid)" };

  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--mono)",
        fontSize: "0.65rem",
        fontWeight: 500,
        letterSpacing: "0.12em",
        color: entry.color,
        border: `1px solid ${entry.color}`,
        padding: "0.15rem 0.45rem",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      [{entry.label}]
    </span>
  );
}
