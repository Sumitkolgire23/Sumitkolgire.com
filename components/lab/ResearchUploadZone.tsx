"use client";

import { useRef, useState, useTransition } from "react";
import { fetchArxivMetadata } from "@/app/(site)/(private)/lab/actions";

interface ResearchUploadZoneProps {
  onImport?: (data: { title: string; url?: string; type: "pdf" | "arxiv" }) => Promise<{ id?: string; error?: string } | any>;
}

export function ResearchUploadZone({ onImport }: ResearchUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  /* ── Drag events ── */
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    if (!dropRef.current?.contains(e.relatedTarget as Node)) setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setStatus("error");
      setStatusMsg("Only PDF files are supported.");
      return;
    }
    handlePdf(file);
  };

  const handlePdf = (file: File) => {
    startTransition(async () => {
      setStatus("loading");
      setStatusMsg(`Importing "${file.name}"…`);
      // Simulate processing — replace with real server action when storage is wired
      await new Promise((r) => setTimeout(r, 1200));
      const title = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
      
      if (onImport) {
        const res = await onImport({ title, type: "pdf" });
        if (res && 'error' in res) {
          setStatus("error");
          setStatusMsg(res.error);
        } else {
          setStatus("success");
          setStatusMsg(`Imported: ${title}`);
        }
      } else {
        setStatus("success");
        setStatusMsg(`Imported: ${title}`);
      }
      setTimeout(() => { setStatus("idle"); setStatusMsg(""); }, 3000);
    });
  };

  const isArxiv = (raw: string) =>
    /arxiv\.org\/abs\/[\d.]+/i.test(raw) || /^\d{4}\.\d{4,5}(v\d+)?$/.test(raw.trim());

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = url.trim();
    if (!raw) return;

    if (isArxiv(raw)) {
      const id = raw.match(/([\d.]+(?:v\d+)?)$/)?.[1] ?? raw;
      startTransition(async () => {
        setStatus("loading");
        setStatusMsg(`Fetching arXiv:${id}…`);
        try {
          const meta = await fetchArxivMetadata(id);
          if (meta.error) {
             setStatus("error");
             setStatusMsg(meta.error);
             setTimeout(() => { setStatus("idle"); setStatusMsg(""); }, 3000);
             return;
          }
          
          const title = meta.title;
          if (onImport) {
            const importRes = await onImport({ title, url: meta.url, type: "arxiv" });
            if (importRes && 'error' in importRes) {
               setStatus("error");
               setStatusMsg(importRes.error);
            } else {
               setStatus("success");
               setStatusMsg(`Imported: ${title}`);
               setUrl("");
            }
          } else {
            setStatus("success");
            setStatusMsg(`Imported: ${title}`);
            setUrl("");
          }
          setTimeout(() => { setStatus("idle"); setStatusMsg(""); }, 3500);
        } catch {
          setStatus("error");
          setStatusMsg("Could not fetch arXiv metadata. Check the ID.");
          setTimeout(() => { setStatus("idle"); setStatusMsg(""); }, 3000);
        }
      });
    } else {
      setStatus("error");
      setStatusMsg("Paste a valid arXiv link or paper ID (e.g. 2312.00752).");
      setTimeout(() => { setStatus("idle"); setStatusMsg(""); }, 3000);
    }
  };

  const statusColors: Record<typeof status, string> = {
    idle:    "var(--text3)",
    loading: "var(--gold)",
    success: "var(--moss)",
    error:   "var(--seal)",
  };

  return (
    <div
      ref={dropRef}
      className={`upload-zone${isDragging ? " drag-over" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => status === "idle" && inputRef.current?.click()}
      style={{ cursor: "pointer" }}
      aria-label="Drop PDF or paste arXiv link"
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePdf(file);
          e.target.value = "";
        }}
      />

      {status === "idle" && !isPending ? (
        <>
          <div className="upload-icon" aria-hidden="true">
            {isDragging ? "⬇" : "↑"}
          </div>
          <div className="upload-text">
            {isDragging
              ? "Release to import PDF"
              : "Drop PDF here, or click to browse"}
          </div>
          {/* arXiv paste form */}
          <form
            onSubmit={handleUrlSubmit}
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", gap: 6, marginTop: 12, width: "100%", maxWidth: 380 }}
          >
            <input
              className="search-input"
              style={{ flex: 1, fontSize: "0.8rem" }}
              placeholder="Paste arXiv link or ID…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="arXiv URL or ID"
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flexShrink: 0 }}
              disabled={!url.trim()}
            >
              Import ↗
            </button>
          </form>
        </>
      ) : (
        <>
          <div
            className="upload-icon"
            style={{ color: statusColors[status] }}
            aria-live="polite"
          >
            {status === "loading" ? "⟳" : status === "success" ? "✓" : "✕"}
          </div>
          <div className="upload-text" style={{ color: statusColors[status] }}>
            {statusMsg}
          </div>
        </>
      )}
    </div>
  );
}
