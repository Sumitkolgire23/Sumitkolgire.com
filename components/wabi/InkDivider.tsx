export function InkDivider({ className = "" }: { className?: string }) {
  return (
    <hr
      className={className}
      style={{
        border: "none",
        height: "1px",
        background:
          "linear-gradient(to right, transparent, var(--ink) 20%, var(--ink) 80%, transparent)",
        opacity: 0.18,
        margin: "2rem 0",
      }}
    />
  );
}
