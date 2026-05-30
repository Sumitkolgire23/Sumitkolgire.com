"use client";

import { useState, useTransition, useRef } from "react";
import { updateLabEntryMeta, deleteLabEntry } from "@/app/(site)/(private)/lab/actions";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

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

  // ── AI ASSISTANT STATES & HANDLERS ────────────────────────────────
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [crawledUrl, setCrawledUrl] = useState("");
  const [hasSuggestions, setHasSuggestions] = useState(false);

  const handleAutoTag = async () => {
    const titleEl = document.querySelector(".editor-title-input") as HTMLTextAreaElement | null;
    const editorEl = document.querySelector(".ProseMirror") || document.querySelector(".editor-body");
    
    const titleText = titleEl?.value || "";
    const contentText = editorEl?.textContent || "";

    setAiLoading(true);
    setAiFeedback("Analyzing content for tags...");
    setHasSuggestions(false);
    try {
      const res = await fetch("/api/ai/autotag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleText, content: contentText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tags)) {
          const merged = Array.from(new Set([...tags, ...data.tags])).map(t => t.toLowerCase());
          setTags(merged);
          updateTagsDebounced(merged);
          setAiFeedback(`Suggested & applied tags: ${data.tags.join(", ")}`);
        } else {
          setAiFeedback("No tags suggested.");
        }
      } else {
        setAiFeedback("Failed to suggest tags.");
      }
    } catch (err) {
      console.error(err);
      setAiFeedback("API network error.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAskAssistant = async () => {
    const editorEl = document.querySelector(".ProseMirror") || document.querySelector(".editor-body");
    const contentText = editorEl?.textContent || "";

    setAiLoading(true);
    setAiFeedback("Querying writing assistant...");
    setHasSuggestions(false);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentText, request: aiPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiFeedback(data.suggestion || "No suggestion returned.");
        setAiPrompt("");
      } else {
        setAiFeedback("Failed to reach Nirvana writing assistant.");
      }
    } catch (err) {
      console.error(err);
      setAiFeedback("API network error.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAutofill = async () => {
    if (!crawledUrl) return;
    setAiLoading(true);
    setAiFeedback("Crawling and analyzing reference url...");
    setHasSuggestions(false);
    try {
      const res = await fetch("/api/ai/resource-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: crawledUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiFeedback(
          `AI Crawled Reference:\nTitle: ${data.title}\nDomain: ${data.domain}\nType: ${data.type}\nNote: ${data.note}`
        );
        // Save references
        (window as any)._crawledSuggestions = data;
        setHasSuggestions(true);
      } else {
        setAiFeedback("Failed to crawl the url.");
      }
    } catch (err) {
      console.error(err);
      setAiFeedback("API network error.");
    } finally {
      setAiLoading(false);
    }
  };

  const applySuggestions = () => {
    const data = (window as any)._crawledSuggestions;
    if (!data) return;

    const titleEl = document.querySelector(".editor-title-input") as HTMLTextAreaElement | null;
    if (titleEl) {
      titleEl.value = data.title;
      titleEl.dispatchEvent(new Event("input", { bubbles: true }));
    }

    if (data.type) {
      const matchedType = data.type.toLowerCase();
      setType(matchedType);
      update({ type: matchedType });
    }

    if (data.domain) {
      const domainTag = data.domain.toLowerCase();
      if (!tags.includes(domainTag)) {
        const next = [...tags, domainTag];
        setTags(next);
        updateTagsDebounced(next);
      }
    }

    setAiFeedback(`Applied successfully!\n\nSuggested Note (paste to entry):\n"${data.note}"`);
    setHasSuggestions(false);
    (window as any)._crawledSuggestions = null;
    setCrawledUrl("");
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

      {/* Nirvana AI Assistant */}
      <div className="rp-section animate-fade-in" style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.25rem" }}>
        <div className="rp-label" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--seal)", textTransform: "uppercase", fontSize: "10px", fontWeight: "bold" }}>
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Nirvana AI Assistant
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
          {/* Tag Suggestion button */}
          <button
            type="button"
            disabled={aiLoading}
            onClick={handleAutoTag}
            style={{
              width: "100%",
              fontFamily: "var(--mono)",
              fontSize: "10px",
              padding: "6px 8px",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--seal)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            {aiLoading ? "Analyzing..." : "Auto-Suggest Tags"}
          </button>

          {/* Ask Assistant prompt */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <textarea
              placeholder="Ask Nirvana for feedback, edits, or outline ideas..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                background: "var(--bg4)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontSize: "11px",
                fontFamily: "var(--sans)",
                padding: "6px",
                borderRadius: "4px",
                resize: "none",
                outline: "none"
              }}
            />
            <button
              type="button"
              disabled={aiLoading || !aiPrompt.trim()}
              onClick={handleAskAssistant}
              style={{
                width: "100%",
                fontFamily: "var(--mono)",
                fontSize: "10px",
                padding: "5px 8px",
                background: "var(--seal)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background 0.2s",
                opacity: (aiLoading || !aiPrompt.trim()) ? 0.5 : 1
              }}
            >
              {aiLoading ? "Querying..." : "Ask Assistant"}
            </button>
          </div>

          {/* Crawler Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <input
              type="text"
              placeholder="Paste reference link/url to crawl..."
              value={crawledUrl}
              onChange={(e) => setCrawledUrl(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg4)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontSize: "11px",
                fontFamily: "var(--sans)",
                padding: "6px",
                borderRadius: "4px",
                outline: "none"
              }}
            />
            <button
              type="button"
              disabled={aiLoading || !crawledUrl.trim()}
              onClick={handleAutofill}
              style={{
                width: "100%",
                fontFamily: "var(--mono)",
                fontSize: "10px",
                padding: "5px 8px",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                borderRadius: "4px",
                cursor: "pointer",
                opacity: (aiLoading || !crawledUrl.trim()) ? 0.5 : 1
              }}
            >
              {aiLoading ? "Crawling..." : "Autofill Reference Link"}
            </button>
          </div>

          {/* AI Response Display Box */}
          {aiFeedback && (
            <div
              style={{
                background: "var(--bg4)",
                border: "1px solid var(--border2)",
                borderRadius: "4px",
                padding: "10px",
                fontSize: "11px",
                color: "var(--text2)",
                lineHeight: "1.5",
                maxHeight: "180px",
                overflowY: "auto",
                position: "relative"
              }}
            >
              <button
                type="button"
                onClick={() => { setAiFeedback(""); setHasSuggestions(false); }}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "6px",
                  background: "none",
                  border: "none",
                  color: "var(--text4)",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                ×
              </button>
              <div style={{ whiteSpace: "pre-wrap", marginRight: "12px" }}>
                {aiFeedback}
              </div>
              
              {hasSuggestions && (
                <button
                  type="button"
                  onClick={applySuggestions}
                  style={{
                    marginTop: "8px",
                    width: "100%",
                    fontFamily: "var(--mono)",
                    fontSize: "9px",
                    padding: "4px",
                    background: "var(--seal2)",
                    color: "var(--seal)",
                    border: "1px solid var(--seal)",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Apply Metadata Suggestions
                </button>
              )}
            </div>
          )}
        </div>
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
