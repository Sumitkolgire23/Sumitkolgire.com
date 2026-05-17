"use client";

import { useTransition, useState } from "react";
import { promoteIdea } from "@/app/(site)/(private)/lab/actions";

const RIPENESS_LADDER = ["seed", "sprout", "ripe", "published"] as const;
type Ripeness = (typeof RIPENESS_LADDER)[number];

const RIPENESS_LABELS: Record<Ripeness, string> = {
  seed: "Seed 🌱",
  sprout: "Sprout 🌿",
  ripe: "Ripe 🍎",
  published: "Published ↗",
};

interface PromoteButtonProps {
  id: string;
  initialRipeness: string;
}

export function PromoteButton({ id, initialRipeness }: PromoteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [ripeness, setRipeness] = useState(initialRipeness as Ripeness);
  const [flash, setFlash] = useState<"success" | "error" | null>(null);

  const isMax = RIPENESS_LADDER.indexOf(ripeness) === RIPENESS_LADDER.length - 1;
  const nextIdx = RIPENESS_LADDER.indexOf(ripeness) + 1;
  const nextLabel =
    !isMax ? RIPENESS_LABELS[RIPENESS_LADDER[nextIdx]] : null;

  function handlePromote(e: React.MouseEvent) {
    // Stop event — button is nested inside a <Link> card
    e.preventDefault();
    e.stopPropagation();
    if (isMax || isPending) return;

    startTransition(async () => {
      const result = await promoteIdea(id, ripeness);
      if ("nextRipeness" in result) {
        setRipeness(result.nextRipeness);
        setFlash("success");
        setTimeout(() => setFlash(null), 1500);
      } else {
        setFlash("error");
        setTimeout(() => setFlash(null), 1500);
      }
    });
  }

  if (isMax) {
    return (
      <span
        className="promote-btn"
        style={{ opacity: 0.4, cursor: "default", borderColor: "transparent" }}
        aria-label="Already published"
      >
        ✓ Published
      </span>
    );
  }

  return (
    <button
      type="button"
      className="promote-btn"
      onClick={handlePromote}
      disabled={isPending}
      aria-label={`Promote to ${nextLabel}`}
      style={{
        opacity: isPending ? 0.6 : 1,
        transition: "all .2s",
        ...(flash === "success"
          ? { borderColor: "var(--moss)", color: "var(--moss)", background: "var(--moss2)" }
          : flash === "error"
          ? { borderColor: "var(--seal)", color: "var(--seal)" }
          : {}),
      }}
    >
      {isPending
        ? "…"
        : flash === "success"
        ? `→ ${RIPENESS_LABELS[RIPENESS_LADDER[nextIdx]]}`
        : "↑ Promote"}
    </button>
  );
}
