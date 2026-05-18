"use client";

import { useState } from "react";
import { addReaction } from "@/app/(site)/(public)/actions";

interface ReactionBarProps {
  postSlug: string;
}

export function ReactionBar({ postSlug }: ReactionBarProps) {
  const [reacted, setReacted] = useState<string | null>(null);

  const handleReaction = async (type: 'like' | 'idea' | 'fire') => {
    if (reacted) return;
    setReacted(type);
    
    // Optimistic UI could increment a local count here if we had one
    
    const { success } = await addReaction(postSlug, type);
    if (!success) {
      // Revert if failed
      setReacted(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "2rem" }}>
      <span style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        React:
      </span>
      <button 
        onClick={() => handleReaction('like')}
        disabled={reacted !== null}
        style={{
          background: reacted === 'like' ? "var(--seal)" : "var(--bg2)",
          border: `1px solid ${reacted === 'like' ? "var(--seal)" : "var(--border)"}`,
          color: reacted === 'like' ? "#fff" : "var(--text)",
          padding: "6px 12px",
          borderRadius: "16px",
          cursor: reacted !== null ? "default" : "pointer",
          transition: "all 0.2s",
          opacity: reacted && reacted !== 'like' ? 0.5 : 1
        }}
      >
        👍
      </button>
      <button 
        onClick={() => handleReaction('idea')}
        disabled={reacted !== null}
        style={{
          background: reacted === 'idea' ? "var(--sky)" : "var(--bg2)",
          border: `1px solid ${reacted === 'idea' ? "var(--sky)" : "var(--border)"}`,
          color: reacted === 'idea' ? "#fff" : "var(--text)",
          padding: "6px 12px",
          borderRadius: "16px",
          cursor: reacted !== null ? "default" : "pointer",
          transition: "all 0.2s",
          opacity: reacted && reacted !== 'idea' ? 0.5 : 1
        }}
      >
        💡
      </button>
      <button 
        onClick={() => handleReaction('fire')}
        disabled={reacted !== null}
        style={{
          background: reacted === 'fire' ? "var(--amber)" : "var(--bg2)",
          border: `1px solid ${reacted === 'fire' ? "var(--amber)" : "var(--border)"}`,
          color: reacted === 'fire' ? "#fff" : "var(--text)",
          padding: "6px 12px",
          borderRadius: "16px",
          cursor: reacted !== null ? "default" : "pointer",
          transition: "all 0.2s",
          opacity: reacted && reacted !== 'fire' ? 0.5 : 1
        }}
      >
        🔥
      </button>
    </div>
  );
}
