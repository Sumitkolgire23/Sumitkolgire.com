import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import LabEditor from "@/components/lab/LabEditor";
import MetadataPanel from "@/components/lab/MetadataPanel";

const SECTION_MAP: Record<string, string> = {
  diary: "Daily Diary", research: "Research",
  ideas: "Ideas Wall",  reading: "Reading List",
};

export default async function LabEntryPage({
  params,
}: { params: Promise<{ section: string; id: string }> }) {
  const { section, id } = await params;
  if (!SECTION_MAP[section] && section !== "published") redirect("/lab");

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Verify ownership — prevents IDOR (any auth'd user reading another's entry by UUID)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("lab_entries")
    .select("id, title, content, tags, type, mood, visibility, word_count, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)   // ← ownership guard: users can only read their own entries
    .is("deleted_at", null)
    .single();

  if (!entry) notFound();

  return (
    <>
      {/* Editor occupies lab-main (center column of the shell grid) */}
      <div className="editor-view fade-in">
        {/* Breadcrumb */}
        <div className="editor-back">
          <span className="editor-breadcrumb">
            <Link href="/lab" style={{ color: "var(--text3)", textDecoration: "none" }}>Lab</Link>
            {" / "}
            <Link href={`/lab/${section}`} style={{ color: "var(--text3)", textDecoration: "none" }}>
              {SECTION_MAP[section] ?? section}
            </Link>
            {" /"}
          </span>
        </div>

        <LabEditor
          entryId={entry.id}
          section={section}
          initialTitle={entry.title}
          initialContent={entry.content}
          initialTags={entry.tags}
        />
      </div>

      {/*
        MetadataPanel renders into the right-panel grid column.
        The layout shell already has grid-template-columns: 220px 1fr 260px.
        We place it as the next sibling of lab-main so CSS grid puts it in col 3.
      */}
      <MetadataPanel
        entryId={entry.id}
        section={section}
        initialVisibility={entry.visibility}
        initialType={entry.type}
        initialMood={entry.mood}
        initialTags={entry.tags ?? []}
        initialWordCount={entry.word_count ?? 0}
        createdAt={entry.created_at}
        updatedAt={entry.updated_at}
      />
    </>
  );
}
