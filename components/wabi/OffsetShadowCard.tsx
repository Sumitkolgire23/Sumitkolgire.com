import { ReactNode } from "react";

interface OffsetShadowCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function OffsetShadowCard({
  children,
  className = "",
  href,
}: OffsetShadowCardProps) {
  const styles: React.CSSProperties = {
    position: "relative",
    background: "var(--paper-light)",
    border: "1px solid var(--ink-faint)",
    padding: "1.5rem",
    boxShadow: "3px 3px 0 var(--ink-faint)",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
  };

  const hoverClass =
    "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--ink-faint)]";

  if (href) {
    return (
      <a href={href} className={`block no-underline ${hoverClass} ${className}`} style={styles}>
        {children}
      </a>
    );
  }

  return (
    <div className={`${hoverClass} ${className}`} style={styles}>
      {children}
    </div>
  );
}
