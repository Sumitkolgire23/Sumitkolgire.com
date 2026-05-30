import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SealVariant = "latin" | "kanji" | "svg";

interface SealStampProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: SealVariant;
  animate?: boolean;
}

export function SealStamp({
  text = "SUMIT",
  size = "md",
  variant = "latin",
  animate = true,
  className,
  ...props
}: SealStampProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-[7px]",
    md: "w-12 h-12 text-[9px]",
    lg: "w-16 h-16 text-[11px]",
  };

  // Render the inner content based on the selected variant
  const renderContent = () => {
    if (variant === "kanji") {
      // Kanji / Katakana variant phonetically matching "Sumit"
      return (
        <span className="seal-stamp-kanji" style={{ writingMode: "vertical-rl", fontFamily: "'Noto Serif JP', 'Source Han Serif JP', serif", fontWeight: 700 }}>
          スミット
        </span>
      );
    }

    if (variant === "svg") {
      // Artistic double ring seal stamp with monogram/Kanji
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: "100%", height: "100%", color: "var(--seal)" }}
        >
          {/* Outer circle */}
          <circle cx="50" cy="50" r="46" strokeWidth="3" />
          {/* Inner circle (creates traditional double-ring feel) */}
          <circle cx="50" cy="50" r="40" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Center Monogram character */}
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            fontSize="32"
            fontWeight="bold"
            fontFamily="'Noto Serif JP', 'Source Han Serif JP', serif"
          >
            墨
          </text>
          {/* Traditional decorative frame lines inside the seal */}
          <path d="M22,50 L30,50 M70,50 L78,50" strokeWidth="2" />
        </svg>
      );
    }

    // Default Latin
    return text;
  };

  return (
    <div
      className={cn(
        "seal-stamp shrink-0 select-none",
        sizeClasses[size],
        animate && "seal-stamp-rotate",
        className
      )}
      data-animate={animate ? "true" : undefined}
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: variant === "svg" ? "none" : "1.5px solid var(--seal)",
        color: "var(--seal)",
        textTransform: "uppercase",
        letterSpacing: variant === "kanji" ? "0" : "0.05em",
        cursor: "pointer",
        ...props.style
      }}
      {...props}
    >
      {renderContent()}
    </div>
  );
}
export default SealStamp;
