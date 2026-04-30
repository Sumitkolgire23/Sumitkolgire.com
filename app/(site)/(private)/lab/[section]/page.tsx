import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createLabEntry } from "@/app/(site)/(private)/lab/actions";
import { redirect } from "next/navigation";

const SECTION_META: Record<string, {
  label: string; icon: string; type: string;
  filters: { label: string; value: string }[];
  emptyText: string;
}> = {
  diary: {
    label: "Daily Diary", icon: "✎", type: "log",
    filters: [
      { label: "All", value: "" },
      { label: "Log", value: "log" },
    ],
    emptyText: "No diary entries yet. Begin writing.",
  },
  research: {
    label: "Research Papers", icon: "◈", type: "research",
    filters: [{ label: "All", value: "" }, { label: "Research", value: "research" }],
    emptyText: "No research notes yet.",
  },
  ideas: {
    label: "Ideas Wall", icon: "✦", type: "idea",
    filters: [{ label: "All", value: "" }, { label: "Idea", value: "idea" }],
    emptyText: "No ideas yet. Plant a seed.",
  },
  reading: {
    label: "Reading List", icon: "≡", type: "reference",
    filters: [{ label: "All", value: "" }, { label: "Reference", value: "reference" }],
    emptyText: "No reading list items yet.",
  },
  projects: {
    label: "Projects", icon: "⬡", type: "experiment",
    filters: [{ label: "All", value: "" }, { label: "Experiment", value: "experiment" }],
    emptyText: "No project notes yet.",
  },
  published: {
    label: "Published", icon: "↗", type: "log",
    filters: [{ label: "Public", value: "public" }],
    emptyText: "Nothing published yet.",
  },
};

const PILL_COLORS: Record<string, { color: string; bg: string }> = {
  log:        { color: "var(--muted)",  bg: "var(--paper-3)" },
  research:   { color: "var(--teal)",   bg: "rgba(13,148,136,.08)" },
  idea:       { color: "var(--gold)",   bg: "rgba(139,115,85,.08)" },
  reference:  { color: "var(--moss)",   bg: "rgba(45,106,79,.08)" },
  experiment: { color: "var(--seal)",   bg: "rgba(196,30,58,.06)" },
};

async function handleNew(section: string) {
  "use server";
  const result = await createLabEntry(section);
  if ("id" in result) {
    redirect(`/lab/${section}/${result.id}`);
  }
}

export default async function SectionFeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const { section } = await params;
  const { q = "", filter = "" } = await searchParams;

  const meta = SECTION_META[section];
  if (!meta) notFound();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Build query
  let query = supabase
    .from("lab_entries")
    .select("id, type, title, content, tags, word_count, visibility, created_at, updated_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (section === "published") {
    query = query.eq("visibility", "public");
  } else {
    query = query.eq("type", meta.type);
  }

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data } = await query;
  const entries = data ?? [];

  const newEntryAction = handleNew.bind(null, section);

  return (
    <>
      {/* Top bar */}
      <div className="lab-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--ghost)" }}>
            <Link href="/lab" style={{ color: "var(--ghost)", textDecoration: "none" }}>Lab</Link>
            {" "}/ 
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {meta.icon} {meta.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Search */}
          <form method="GET" style={{ display: "flex", alignItems: "center" }}>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search entries…"
              style={{
                padding: "0.4rem 0.75rem",
                fontFamily: "var(--mono)",
                fontSize: "0.72rem",
                color: "var(--ink)",
                background: "var(--paper-2)",
                border: "1px solid var(--ink-faint)",
                outline: "none",
                width: 200,
              }}
            />
          </form>
          {/* New entry */}
          {section !== "published" && (
            <form action={newEntryAction}>
              <button type="submit" style={{
                padding: "0.4rem 1rem",
                background: "var(--ink)",
                color: "var(--paper)",
                fontFamily: "var(--mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
              }}>
                + New
              </button>
            </form>
          )}
        </div>
      </div>

      <div style={{ padding: "2rem 3rem", maxWidth: 860, animation: "fadeIn 0.5s ease-out" }}>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {meta.filters.map((f) => (
            <Link
              key={f.value}
              href={`/lab/${section}?filter=${f.value}`}
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.3rem 0.75rem",
                background: filter === f.value ? "rgba(196,30,58,0.06)" : "transparent",
                border: `1px solid ${filter === f.value ? "var(--seal)" : "var(--ink-faint)"}`,
                color: filter === f.value ? "var(--seal)" : "var(--muted)",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </Link>
          ))}
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--ghost)", marginLeft: "auto", alignSelf: "center" }}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Entry list */}
        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", border: "1px dashed var(--ink-faint)", background: "var(--paper-2)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.3 }}>{meta.icon}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--muted)", fontStyle: "italic", marginBottom: "1.5rem" }}>
              {meta.emptyText}
            </div>
            {section !== "published" && (
              <form action={newEntryAction}>
                <button type="submit" style={{
                  padding: "0.65rem 1.5rem",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  fontFamily: "var(--mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                }}>
                  Write First Entry
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            {entries.map((entry, i) => {
              const pill = PILL_COLORS[entry.type] ?? PILL_COLORS.log;
              return (
                <Link
                  key={entry.id}
                  href={`/lab/${section}/${entry.id}`}
                  style={{ display: "block", textDecoration: "none", animationDelay: `${i * 0.05}s`, animation: "fadeIn 0.4s ease-out backwards" }}
                >
                  <div className="entry-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <span style={{
                        fontFamily: "var(--mono)", fontSize: "0.58rem", fontWeight: 600,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "0.15rem 0.5rem", color: pill.color,
                        background: pill.bg, border: `1px solid ${pill.color}33`,
                      }}>
                        {entry.type}
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--ghost)" }}>
                        {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {entry.visibility === "public" && (
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--ok)", marginLeft: "auto" }}>↗ Public</span>
                      )}
                      {entry.word_count > 0 && (
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--ghost)", marginLeft: entry.visibility === "public" ? 0 : "auto" }}>
                          {entry.word_count}w
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.35rem" }}>
                      {entry.title || "Untitled"}
                    </div>
                    {entry.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {entry.tags.slice(0, 5).map((t: string) => (
                          <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--muted)" }}>#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
