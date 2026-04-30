"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState, useCallback } from "react";
import { saveLabEntry } from "@/app/(site)/(private)/lab/actions";

interface LabEditorProps {
  entryId: string;
  section: string;
  initialTitle?: string;
  initialContent?: object;
  initialTags?: string[];
}

const AUTOSAVE_MS = 3000;

export default function LabEditor({
  entryId,
  section,
  initialTitle = "",
  initialContent,
  initialTags = [],
}: LabEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [wordCount, setWordCount] = useState(0);
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder: "Start writing. The page is yours." }),
    ],
    content: initialContent && Object.keys(initialContent).length ? initialContent : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onUpdate({ editor }) {
      const text = editor.getText();
      const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(wc);
      triggerSave(editor.getJSON(), wc);
    },
  });

  const triggerSave = useCallback((content: object, wc: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");
    timerRef.current = setTimeout(async () => {
      const res = await saveLabEntry(entryId, {
        title: titleRef.current?.value ?? title,
        content,
        tags,
        wordCount: wc,
      });
      setSaveStatus(res.ok ? "saved" : "error");
    }, AUTOSAVE_MS);
  }, [entryId, tags]); // eslint-disable-line

  // Re-save when tags change
  useEffect(() => {
    if (saveStatus === "idle" || !editor) return;
    triggerSave(editor.getJSON(), wordCount);
  }, [tags]); // eslint-disable-line

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // Auto-resize title
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (t && !tags.includes(t) && tags.length < 10) setTags(p => [...p, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(p => p.filter(t => t !== tag));

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const BubbleBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? "rgba(196,30,58,0.25)" : "transparent",
        border: "none",
        color: active ? "#f8b4bc" : "rgba(247,243,236,0.85)",
        fontFamily: "var(--mono)",
        fontSize: "0.72rem",
        fontWeight: 600,
        padding: "5px 10px",
        cursor: "pointer",
        transition: "background 0.12s",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--paper)" }}>

      {/* Editor body */}
      <div style={{ flex: 1, padding: "4rem 5rem 2rem", maxWidth: 840, margin: "0 auto", width: "100%", animation: "fadeIn 0.5s ease-out" }}>

        {/* Title */}
        <textarea
          ref={titleRef}
          placeholder="Untitled"
          defaultValue={initialTitle}
          rows={1}
          aria-label="Entry title"
          onChange={(e) => {
            setTitle(e.target.value);
            autoResize(e.target);
            triggerSave(editor?.getJSON() ?? {}, wordCount);
          }}
          onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
          style={{
            width: "100%",
            fontFamily: "var(--serif)",
            fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
            fontWeight: 700,
            color: "var(--ink)",
            background: "transparent",
            border: "none",
            outline: "none",
            padding: 0,
            resize: "none",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
            overflow: "hidden",
          }}
        />

        {/* Tags row */}
        <div style={{
          display: "flex", alignItems: "center", flexWrap: "wrap",
          gap: "0.4rem", marginBottom: "2rem",
          paddingBottom: "1.25rem", borderBottom: "1px solid var(--ink-faint)",
        }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              fontFamily: "var(--mono)", fontSize: "0.65rem",
              color: "var(--muted)", background: "var(--paper-2)",
              border: "1px solid var(--ink-faint)",
              padding: "0.2rem 0.55rem", transition: "border-color 0.15s",
            }}>
              #{tag}
              <span
                role="button"
                aria-label={`Remove tag ${tag}`}
                onClick={() => removeTag(tag)}
                style={{ cursor: "pointer", opacity: 0.5, lineHeight: 1, marginLeft: 2 }}
              >×</span>
            </span>
          ))}
          <input
            aria-label="Add tag"
            value={tagInput}
            placeholder="+ add tag"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "," || e.key === " ") { e.preventDefault(); addTag(); }
              if (e.key === "Backspace" && !tagInput && tags.length) removeTag(tags[tags.length - 1]);
            }}
            onBlur={addTag}
            style={{
              fontFamily: "var(--mono)", fontSize: "0.65rem",
              color: "var(--ink)", background: "transparent",
              border: "none", outline: "none", minWidth: 80,
            }}
          />
        </div>

        {/* Bubble menu */}
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 80, placement: "top" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 1,
              background: "#151410",
              border: "1px solid rgba(247,243,236,0.1)",
              padding: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}>
              <BubbleBtn label="B"  active={editor.isActive("bold")}       onClick={() => editor.chain().focus().toggleBold().run()} />
              <BubbleBtn label="I"  active={editor.isActive("italic")}     onClick={() => editor.chain().focus().toggleItalic().run()} />
              <BubbleBtn label="U"  active={editor.isActive("underline")}  onClick={() => editor.chain().focus().toggleUnderline().run()} />
              <BubbleBtn label="H2" active={editor.isActive("heading", {level:2})} onClick={() => editor.chain().focus().toggleHeading({level:2}).run()} />
              <BubbleBtn label="H3" active={editor.isActive("heading", {level:3})} onClick={() => editor.chain().focus().toggleHeading({level:3}).run()} />
              <BubbleBtn label="❝" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
              <BubbleBtn label="{ }" active={editor.isActive("code")}     onClick={() => editor.chain().focus().toggleCode().run()} />
              <BubbleBtn label="—"  active={false}                         onClick={() => editor.chain().focus().setHorizontalRule().run()} />
            </div>
          </BubbleMenu>
        )}

        {/* TipTap editor */}
        <div style={{ minHeight: "50vh" }}>
          <EditorContent editor={editor} />
        </div>

        {/* Keyboard hint */}
        <div style={{
          marginTop: "3rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--ink-faint)",
          fontFamily: "var(--mono)",
          fontSize: "0.6rem",
          color: "var(--ghost)",
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}>
          <span>Select text for formatting toolbar</span>
          <span>Ctrl+B Bold · Ctrl+I Italic</span>
          <span>Tab for code block · &gt; for blockquote</span>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.6rem 5rem",
        borderTop: "1px solid var(--ink-faint)",
        background: "var(--paper-2)",
        fontFamily: "var(--mono)",
        fontSize: "0.62rem",
        color: "var(--ghost)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {saveStatus !== "idle" && (
            <>
              <div className={`save-dot ${saveStatus}`} />
              <span style={{ color: saveStatus === "error" ? "var(--danger)" : "var(--ghost)" }}>
                {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Failed to save"}
              </span>
            </>
          )}
        </div>
        <span>
          {wordCount > 0 ? `${wordCount} words · ~${readingTime} min read` : "Start writing…"}
        </span>
      </div>
    </div>
  );
}
