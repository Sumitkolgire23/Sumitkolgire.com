import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SealStampProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function SealStamp({
  text = "SUMIT",
  size = "md",
  className,
  ...props
}: SealStampProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-[8px]",
    md: "w-12 h-12 text-[9px]",
    lg: "w-16 h-16 text-xs",
  };

  return (
    <div
      className={cn(
        "seal-stamp shrink-0 select-none",
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {text}
    </div>
  );
}
