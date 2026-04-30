import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import LabEditor from "@/components/lab/LabEditor";
import MetadataPanel from "@/components/lab/MetadataPanel";

const SECTION_MAP: Record<string, { label: string; icon: string }> = {
  diary:    { label: "Daily Diary", icon: "✎" },
  research: { label: "Research",    icon: "◈" },
  ideas:    { label: "Ideas Wall",  icon: "✦" },
  reading:  { label: "Reading List",icon: "≡" },
  projects: { label: "Projects",    icon: "⬡" },
};

export default async function LabEntryPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section, id } = await params;
  const meta = SECTION_MAP[section];

  // If section doesn't exist, redirect to general dashboard
  if (!meta && section !== "published") redirect("/lab");

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Fetch entry
  const { data: entry } = await supabase
    .from("lab_entries")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (!entry) notFound();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      
      {/* Top bar */}
      <div className="lab-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--ghost)" }}>
            <Link href="/lab" style={{ color: "var(--ghost)", textDecoration: "none" }}>Lab</Link>
            {" "}/{" "}
            <Link href={`/lab/${section}`} style={{ color: "var(--ghost)", textDecoration: "none" }}>{meta?.label || "Archive"}</Link>
            {" "}/
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 300 }}>
            {entry.title || "Untitled"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        
        {/* Main Editor Zone */}
        <LabEditor
          entryId={entry.id}
          section={section}
          initialTitle={entry.title}
          initialContent={entry.content}
          initialTags={entry.tags}
        />

        {/* Right Metadata Zone */}
        <MetadataPanel
          entryId={entry.id}
          section={section}
          initialVisibility={entry.visibility}
          initialType={entry.type}
          createdAt={entry.created_at}
          updatedAt={entry.updated_at}
        />

      </div>
    </div>
  );
}
