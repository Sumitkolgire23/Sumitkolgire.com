"use client";

export function NeuralSVGFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        position: "relative",
        border: "1px solid var(--border)",
        background: "rgba(13, 13, 14, 0.4)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Connection Lines */}
        <line x1="80" y1="80" x2="160" y2="100" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-1" />
        <line x1="160" y1="100" x2="220" y2="60" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-2" />
        <line x1="160" y1="100" x2="240" y2="180" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-3" />
        <line x1="220" y1="60" x2="320" y2="110" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-1" />
        <line x1="240" y1="180" x2="320" y2="110" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-2" />
        <line x1="240" y1="180" x2="200" y2="250" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-3" />
        <line x1="320" y1="110" x2="380" y2="200" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-1" />
        <line x1="200" y1="250" x2="310" y2="260" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-2" />
        <line x1="310" y1="260" x2="380" y2="200" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-3" />
        <line x1="80" y1="200" x2="160" y2="100" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-1" />
        <line x1="80" y1="200" x2="200" y2="250" stroke="rgba(196, 30, 58, 0.2)" strokeWidth="1" className="svg-pulse-line-2" />

        {/* Nodes (Circles with Pulse Animation) */}
        <circle cx="80" cy="80" r="4" fill="var(--seal)" className="svg-node-1" />
        <circle cx="160" cy="100" r="5" fill="var(--seal)" className="svg-node-2" />
        <circle cx="220" cy="60" r="3" fill="var(--seal)" className="svg-node-3" />
        <circle cx="240" cy="180" r="6" fill="var(--seal)" className="svg-node-1" />
        <circle cx="320" cy="110" r="4.5" fill="var(--seal)" className="svg-node-2" />
        <circle cx="200" cy="250" r="4" fill="var(--seal)" className="svg-node-3" />
        <circle cx="380" cy="200" r="5.5" fill="var(--seal)" className="svg-node-1" />
        <circle cx="310" cy="260" r="3" fill="var(--seal)" className="svg-node-2" />
        <circle cx="80" cy="200" r="3" fill="var(--seal)" className="svg-node-3" />
      </svg>

      <style>{`
        .svg-node-1 { animation: svgPulse 3s infinite ease-in-out; }
        .svg-node-2 { animation: svgPulse 4s infinite ease-in-out 1s; }
        .svg-node-3 { animation: svgPulse 3.5s infinite ease-in-out 0.5s; }

        .svg-pulse-line-1 { animation: lineFade 6s infinite ease-in-out; }
        .svg-pulse-line-2 { animation: lineFade 8s infinite ease-in-out 1.5s; }
        .svg-pulse-line-3 { animation: lineFade 7s infinite ease-in-out 0.7s; }

        @keyframes svgPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 4px var(--seal)); }
        }

        @keyframes lineFade {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
