"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExt from "@tiptap/extension-link";
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

/* Fixed toolbar button */
function ToolBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      style={{
        fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
        padding: "4px 8px", borderRadius: 4, border: "none", cursor: "pointer",
        background: active ? "var(--seal2)" : "transparent",
        color: active ? "var(--seal)" : "var(--text3)",
        transition: "all .15s",
      }}
    >
      {label}
    </button>
  );
}

export default function LabEditor({
  entryId, section,
  initialTitle = "",
  initialContent,
  initialTags = [],
}: LabEditorProps) {
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const [wordCount, setWordCount]   = useState(0);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef   = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing. The page is yours." }),
    ],
    content: initialContent && Object.keys(initialContent).length > 0
      ? (initialContent as Parameters<typeof useEditor>[0]["content"])
      : "",
    onUpdate({ editor }) {
      const text = editor.getText();
      const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(wc);
      debounceSave(editor.getJSON(), wc);
    },
  });

  const debounceSave = useCallback((content: object, wc: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");
    timerRef.current = setTimeout(async () => {
      const res = await saveLabEntry(entryId, {
        title: titleRef.current?.value ?? "",
        content, tags: initialTags, wordCount: wc,
      });
      setSaveStatus(res.ok ? "saved" : "error");
    }, AUTOSAVE_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const saveLabel =
    saveStatus === "saving" ? "● Saving..." :
    saveStatus === "saved"  ? "● Saved"      :
    saveStatus === "error"  ? "● Error"       : "";

  return (
    <>
      {/* Fixed formatting toolbar */}
      {editor && (
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          padding: "6px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg2)",
          flexShrink: 0,
        }}>
          <ToolBtn label="B"   active={editor.isActive("bold")}                   onClick={() => editor.chain().focus().toggleBold().run()} />
          <ToolBtn label="I"   active={editor.isActive("italic")}                 onClick={() => editor.chain().focus().toggleItalic().run()} />
          <ToolBtn label="U"   active={editor.isActive("underline")}              onClick={() => editor.chain().focus().toggleUnderline().run()} />
          <span style={{ width: 1, height: 14, background: "var(--border)", margin: "0 4px" }} />
          <ToolBtn label="H2"  active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
          <ToolBtn label="H3"  active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
          <span style={{ width: 1, height: 14, background: "var(--border)", margin: "0 4px" }} />
          <ToolBtn label="❝"   active={editor.isActive("blockquote")}            onClick={() => editor.chain().focus().toggleBlockquote().run()} />
          <ToolBtn label="{ }" active={editor.isActive("code")}                  onClick={() => editor.chain().focus().toggleCode().run()} />
          <ToolBtn label="—"   active={false}                                     onClick={() => editor.chain().focus().setHorizontalRule().run()} />
          {/* Save status */}
          <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10,
            color: saveStatus === "saved" ? "var(--moss)" : saveStatus === "error" ? "var(--seal)" : "var(--text3)" }}>
            {saveLabel}
          </span>
        </div>
      )}

      {/* Editor area */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
        <div style={{ padding: "32px 40px", maxWidth: 800, margin: "0 auto", width: "100%" }}>

          {/* Title */}
          <textarea
            ref={titleRef}
            placeholder="Untitled"
            defaultValue={initialTitle}
            rows={1}
            aria-label="Entry title"
            className="editor-title-input"
            onChange={(e) => { autoResize(e.target); if (editor) debounceSave(editor.getJSON(), wordCount); }}
            onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
          />

          {/* Meta strip */}
          <div className="editor-meta-strip">
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>

          {/* Body */}
          <div className="editor-body">
            <EditorContent editor={editor} />
          </div>

          {/* Bottom bar */}
          <div className="editor-bottombar">
            <div className="wc-display">
              <span>{wordCount}</span> words · ~<span>{readingTime}</span> min read
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
              Select text to format · Ctrl+B · Ctrl+I · &gt; blockquote
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
