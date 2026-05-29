import { twMerge } from "tailwind-merge";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export function Skeleton({
  className,
  width,
  height,
  circle = false,
}: SkeletonProps) {
  return (
    <div
      className={twMerge(
        "skeleton animate-shimmer",
        circle && "rounded-full",
        className
      )}
      style={{
        width,
        height,
      }}
      aria-hidden="true"
    />
  );
}
