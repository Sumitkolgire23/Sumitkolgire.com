import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

/* Map entry type → CSS badge class */
const TYPE_CLASS: Record<string, string> = {
  log: "t-log", reflection: "t-reflection", experiment: "t-experiment",
  breakthrough: "t-breakthrough", research: "t-research", idea: "t-idea", reference: "t-reference",
};
/* Map entry type → section route */
const TYPE_SECTION: Record<string, string> = {
  log: "diary", reflection: "diary", experiment: "diary",
  breakthrough: "diary", research: "research", idea: "ideas", reference: "reading",
};
/* Mood dot colors */
const MOOD_COLOR: Record<string, string> = {
  stillness: "var(--sky)", chaos: "var(--seal)", breakthrough: "var(--gold)", reflection: "var(--moss)",
};

function formatDay(d: string)   { return new Date(d).toLocaleDateString("en-US", { day: "numeric" }); }
function formatMonth(d: string) { return new Date(d).toLocaleDateString("en-US", { month: "short" }).toUpperCase(); }

export default async function LabDiaryFeed() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: raw } = await supabase
    .from("lab_entries")
    .select("id, title, type, mood, word_count, tags, visibility, created_at, content")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const entries = raw ?? [];

  return (
    <div className="lab-main">
    <div className="feed-view fade-in">
      {/* Header */}
      <div className="feed-header">
        <div>
          <div className="feed-title">Daily Diary</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
            {entries.length} entries · private workspace
          </div>
        </div>
        <div className="feed-controls">
          <Link href="/lab/diary/new" className="btn btn-primary">+ New entry</Link>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input className="search-input" placeholder="Search entries..." readOnly />
      </div>

      {/* Filter pills */}
      <div className="filter-pills">
        {["All","Log","Reflection","Experiment","Breakthrough","Research","Private","Public"].map((p) => (
          <button key={p} className={`filter-pill${p === "All" ? " active" : ""}`} type="button">{p}</button>
        ))}
      </div>

      {/* Entry list */}
      {entries.length > 0 ? (
        entries.map((entry) => {
          const section = TYPE_SECTION[entry.type] ?? "diary";
          const typeClass = TYPE_CLASS[entry.type] ?? "t-log";
          const moodDot = MOOD_COLOR[entry.mood ?? ""] ?? "var(--border2)";
          const excerpt = (entry.content ?? "").replace(/<[^>]*>/g, "").slice(0, 120);
          return (
            <Link key={entry.id} href={`/lab/${section}/${entry.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div className="entry-card">
                {/* Date column */}
                <div className="ec-date">
                  <div className="ec-day">{formatDay(entry.created_at)}</div>
                  <div className="ec-mon">{formatMonth(entry.created_at)}</div>
                </div>
                {/* Body */}
                <div>
                  <div className="ec-type-row">
                    <span className={`ec-type ${typeClass}`}>{entry.type}</span>
                    <span className="mood-dot" style={{ background: moodDot }} title={entry.mood ?? ""} />
                  </div>
                  <div className="ec-title">{entry.title || "Untitled"}</div>
                  {excerpt && <div className="ec-excerpt">{excerpt}…</div>}
                  <div className="ec-meta">
                    {(entry.word_count ?? 0) > 0 && (
                      <span className="ec-wc">{entry.word_count}w</span>
                    )}
                    {entry.tags?.length > 0 && (
                      <div className="ec-tags">
                        {(entry.tags as string[]).slice(0, 3).map((t) => (
                          <span key={t} className="ec-tag">#{t}</span>
                        ))}
                      </div>
                    )}
                    <span className={`ec-vis ${entry.visibility === "public" ? "vis-public" : "vis-private"}`}>
                      {entry.visibility === "public" ? "● public" : "○ private"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 16 }}>
            The diary is empty.
          </div>
          <Link href="/lab/diary/new" className="btn btn-primary">Write your first entry</Link>
        </div>
      )}
    </div>
    </div>
  );
}
