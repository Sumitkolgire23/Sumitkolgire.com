"use client";

import { useState, useTransition, useRef } from "react";
import { updateLabEntryMeta, deleteLabEntry } from "@/app/(site)/(private)/lab/actions";
import { useRouter } from "next/navigation";

interface MetadataPanelProps {
  entryId: string;
  section: string;
  initialVisibility?: string;
  initialType?: string;
  initialMood?: string;
  initialTags?: string[];
  initialWordCount?: number;
  /** Live word count driven by LabEditor via shared state (optional) */
  wordCount?: number;
  wordGoal?: number;
  createdAt?: string;
  updatedAt?: string;
}

const ENTRY_TYPES = ["Log","Breakthrough","Reflection","Experiment","Research","Decision"];
const MOODS       = ["Stillness","Chaos","Breakthrough","Reflection"];

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

import { useLabShell } from "@/components/lab/LabShellClient";
import { useEffect } from "react";

export default function MetadataPanel({
  entryId, section,
  initialVisibility = "private",
  initialType       = "log",
  initialMood       = "",
  initialTags       = [],
  initialWordCount  = 0,
  wordCount,          // live count from LabEditor (if provided)
  wordGoal          = 500,
  createdAt, updatedAt,
}: MetadataPanelProps) {
  const { panelOpen, setHasPanel } = useLabShell();
  const [type, setType]             = useState(initialType);
  const [mood, setMood]             = useState(initialMood);
  const [visibility, setVisibility] = useState(initialVisibility);
  const [tags, setTags]             = useState<string[]>(initialTags);
  const [tagInput, setTagInput]     = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const tagDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHasPanel(true);
    return () => setHasPanel(false);
  }, [setHasPanel]);

  const update = (payload: Parameters<typeof updateLabEntryMeta>[1]) =>
    startTransition(() => { void updateLabEntryMeta(entryId, payload); });

  // Debounced tag update — prevents race conditions when tags are added/removed rapidly
  const updateTagsDebounced = (nextTags: string[]) => {
    if (tagDebounceRef.current) clearTimeout(tagDebounceRef.current);
    tagDebounceRef.current = setTimeout(() => {
      update({ tags: nextTags });
    }, 350);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (!t || tags.includes(t)) { setTagInput(""); return; }
    const next = [...tags, t];
    setTags(next);
    setTagInput("");
    updateTagsDebounced(next);
  };
  const removeTag = (t: string) => {
    const next = tags.filter((x) => x !== t);
    setTags(next);
    updateTagsDebounced(next);
  };

  const handleDelete = () => {
    if (!confirm("Delete this entry? It will be soft-deleted and recoverable.")) return;
    startTransition(async () => {
      await deleteLabEntry(entryId);
      router.push(`/lab/${section}`);
    });
  };

  const goalPct = Math.min(100, Math.round(((wordCount ?? initialWordCount) / wordGoal) * 100));
  const displayWordCount = wordCount ?? initialWordCount;

  return (
    <aside className={`lab-rightpanel ${panelOpen ? "open" : ""}`}>

      {/* Entry type */}
      <div className="rp-section">
        <div className="rp-label">Entry type</div>
        <div className="rp-type-grid">
          {ENTRY_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`rp-type-btn${type.toLowerCase() === t.toLowerCase() ? " active" : ""}`}
              onClick={() => { setType(t.toLowerCase()); update({ type: t.toLowerCase() }); }}
              disabled={isPending}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="rp-section">
        <div className="rp-label">Mood</div>
        <div className="mood-grid">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              className={`mood-btn${mood.toLowerCase() === m.toLowerCase() ? " active" : ""}`}
              onClick={() => { setMood(m.toLowerCase()); update({ mood: m.toLowerCase() }); }}
              disabled={isPending}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div className="rp-section">
        <div className="rp-label">Visibility</div>
        <div className="vis-toggle">
          {(["private","public","unlisted"] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={`vis-btn${visibility === v ? ` active-${v}` : ""}`}
              onClick={() => { setVisibility(v); update({ visibility: v }); }}
              disabled={isPending}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="rp-section">
        <div className="rp-label">Tags</div>
        <input
          className="tag-input"
          placeholder="Add tag..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
        />
        {tags.length > 0 && (
          <div className="current-tags">
            {tags.map((t) => (
              <span key={t} className="ctag" onClick={() => removeTag(t)}>
                {t} <span style={{ opacity: .5 }}>×</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Writing goal */}
      <div className="rp-section">
        <div className="rp-label">Writing goal</div>
        <div className="word-goal-wrap">
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)" }}>
            {displayWordCount} / {wordGoal} words today
          </div>
          <div className="goal-bar">
            <div className="goal-fill" style={{ width: `${goalPct}%` }} />
          </div>
          <div className="goal-text"><span>0</span><span>{wordGoal} words</span></div>
        </div>
      </div>

      {/* Dates */}
      <div className="rp-section">
        <div className="rp-label">Dates</div>
        <div className="rp-date">
          Created <span>{fmt(createdAt)}</span><br />
          Edited <span>{updatedAt ? fmt(updatedAt) : "just now"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="rp-section">
        <button
          className="promote-to-sanity"
          type="button"
          disabled={isPending || visibility === "public"}
          onClick={() => {
            setVisibility("public");
            update({ visibility: "public" });
          }}
        >
          <span>↑</span> {visibility === "public" ? "Already public" : "Promote to public draft"}
        </button>
        <button className="delete-entry-btn" type="button" onClick={handleDelete} disabled={isPending}>
          Delete entry
        </button>
      </div>

    </aside>
  );
}
