"use client";

export function NeuralSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        background: "rgba(20, 20, 22, 0.4)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden="true"
    >
      {/* Shimmer overlay */}
      <div
        className="skeleton animate-shimmer"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {/* Node placeholder dots */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(196, 30, 58, 0.15)" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(196, 30, 58, 0.25)" }} />
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(196, 30, 58, 0.15)" }} />
      </div>
    </div>
  );
}
