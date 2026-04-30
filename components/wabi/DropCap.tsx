interface DropCapProps {
  children: string;
  className?: string;
}

export function DropCap({ children, className = "" }: DropCapProps) {
  if (!children) return null;
  const first = children[0];
  const rest = children.slice(1);

  return (
    <span className={className}>
      <span
        aria-hidden="true"
        style={{
          float: "left",
          fontFamily: "var(--serif)",
          fontSize: "4.2rem",
          fontWeight: 700,
          lineHeight: 0.78,
          marginRight: "0.08em",
          marginTop: "0.06em",
          color: "var(--ink)",
        }}
      >
        {first}
      </span>
      {rest}
    </span>
  );
}
