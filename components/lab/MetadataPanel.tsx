"use client";

import { useState, useTransition } from "react";
import { updateLabEntryMeta, deleteLabEntry } from "@/app/(site)/(private)/lab/actions";
import { useRouter } from "next/navigation";

interface MetadataPanelProps {
  entryId: string;
  section: string;
  initialVisibility?: string;
  initialType?: string;
  createdAt?: string;
  updatedAt?: string;
}

const TYPE_OPTIONS = [
  { value: "log",        label: "Log" },
  { value: "research",   label: "Research" },
  { value: "idea",       label: "Idea" },
  { value: "reference",  label: "Reference" },
  { value: "experiment", label: "Experiment" },
];

const VISIBILITY_OPTIONS = [
  { value: "private",  label: "🔒 Private" },
  { value: "unlisted", label: "⚬ Unlisted" },
  { value: "public",   label: "↗ Public" },
];

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function MetadataPanel({
  entryId,
  section,
  initialVisibility = "private",
  initialType = "log",
  createdAt,
  updatedAt,
}: MetadataPanelProps) {
  const [visibility, setVisibility] = useState(initialVisibility);
  const [type, setType] = useState(initialType);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const update = (payload: object) =>
    startTransition(() => updateLabEntryMeta(entryId, payload));

  const handleDelete = () => {
    if (!confirm("Delete this entry? It will be soft-deleted and recoverable.")) return;
    startTransition(async () => {
      await deleteLabEntry(entryId);
      router.push(`/lab/${section}`);
    });
  };

  return (
    <aside className="lab-editor-meta">

      <span className="meta-label">Entry Type</span>
      <select
        className="meta-select"
        value={type}
        onChange={(e) => { setType(e.target.value); update({ type: e.target.value }); }}
        disabled={isPending}
        aria-label="Entry type"
      >
        {TYPE_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <span className="meta-label">Visibility</span>
      <select
        className="meta-select"
        value={visibility}
        onChange={(e) => { setVisibility(e.target.value); update({ visibility: e.target.value }); }}
        disabled={isPending}
        aria-label="Visibility"
      >
        {VISIBILITY_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <span className="meta-label">Created</span>
      <div className="meta-date">{fmt(createdAt)}</div>

      <span className="meta-label">Last edited</span>
      <div className="meta-date">{fmt(updatedAt)}</div>

      <button className="meta-publish-btn" disabled={isPending} type="button">
        Promote to Draft ↗
      </button>

      <button
        className="meta-delete-btn"
        onClick={handleDelete}
        disabled={isPending}
        type="button"
      >
        Delete entry
      </button>

    </aside>
  );
}
