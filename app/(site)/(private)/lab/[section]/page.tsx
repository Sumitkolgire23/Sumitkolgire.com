import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createLabEntry, importResearchEntry } from "@/app/(site)/(private)/lab/actions";
import { ResearchUploadZone } from "@/components/lab/ResearchUploadZone";
import { PromoteButton } from "@/components/lab/PromoteButton";

/* Type maps */
const TYPE_CLASS: Record<string, string> = {
  log: "t-log", reflection: "t-reflection", experiment: "t-experiment",
  breakthrough: "t-breakthrough", research: "t-research", idea: "t-idea", reference: "t-reference",
};
const MOOD_COLOR: Record<string, string> = {
  stillness: "var(--sky)", chaos: "var(--seal)", breakthrough: "var(--gold)", reflection: "var(--moss)",
};

/* Section metadata */
const SECTION_META: Record<string, {
  label: string; type: string; filters: string[]; emptyText: string; isPublished?: boolean;
}> = {
  diary:     { label: "Daily Diary",  type: "log",       filters: ["All","Log","Reflection","Experiment","Breakthrough"], emptyText: "No diary entries yet." },
  research:  { label: "Research",     type: "research",  filters: ["All","Research","Experiment"], emptyText: "No research notes yet." },
  ideas:     { label: "Ideas Wall",   type: "idea",      filters: ["All","Seed","Sprout","Ripe","Published"], emptyText: "No ideas yet. Plant a seed." },
  reading:   { label: "Reading List", type: "reference", filters: ["All","Reading","Done","Want to read"], emptyText: "Reading list is empty." },
  published: { label: "Published",    type: "",          filters: ["All","Article","Note","Thread"], emptyText: "Nothing published yet.", isPublished: true },
};

function fmtDay(d: string)   { return new Date(d).toLocaleDateString("en-US", { day: "numeric" }); }
function fmtMon(d: string)   { return new Date(d).toLocaleDateString("en-US", { month: "short" }).toUpperCase(); }
function fmtFull(d: string)  { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

async function handleNew(section: string) {
  "use server";
  const result = await createLabEntry(section);
  if ("id" in result) redirect(`/lab/${section}/${result.id}`);
}

export default async function SectionFeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string; filter?: string; ripeness?: string }>;
}) {
  const { section } = await params;
  const { q = "", filter = "", ripeness = "" } = await searchParams;

  const meta = SECTION_META[section];
  if (!meta) notFound();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  let query = supabase
    .from("lab_entries")
    .select("id, type, mood, title, content, tags, word_count, visibility, created_at, updated_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (meta.isPublished) {
    query = query.eq("visibility", "public");
  } else {
    if (section === "diary") {
      if (["log", "reflection", "experiment", "breakthrough"].includes(filter)) {
        query = query.eq("type", filter);
      } else if (filter === "public" || filter === "private") {
        query = query.in("type", ["log", "reflection", "experiment", "breakthrough"]);
        query = query.eq("visibility", filter);
      } else {
        query = query.in("type", ["log", "reflection", "experiment", "breakthrough"]);
      }
    } else {
      query = query.eq("type", meta.type);
    }
  }
  if (q) query = query.ilike("title", `%${q}%`);

  const { data } = await query;
  const entries = data ?? [];

  const newAction = handleNew.bind(null, section);

  /* ── PUBLISHED VIEW ─────────────────────────────────── */
  if (meta.isPublished) {
    const { data: viewData } = await supabase.from("page_views").select("slug, count");
    const viewsMap = new Map(viewData?.map((v) => [v.slug, v.count]) || []);
    const totalViews = viewData?.reduce((acc, row) => acc + (row.count || 0), 0) || 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthCount = entries.filter((e) => new Date(e.created_at) >= startOfMonth).length;

    return (
      <div className="lab-main">
        <div className="published-view fade-in">
          <div className="feed-header">
            <div>
              <div className="feed-title">Published</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
                {entries.length} public entries
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="pub-stats">
            {[
              { num: String(entries.length), label: "Published" },
              { num: String(totalViews), label: "Total views" },
              { num: String(thisMonthCount), label: "This month" },
            ].map((s) => (
              <div key={s.label} className="pub-stat">
                <div className="ps-num">{s.num}</div>
                <div className="ps-label">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Filter pills */}
          <div className="filter-pills">
            {meta.filters.map((f) => {
              const fVal = f === "All" ? "" : f.toLowerCase();
              const isActive = filter === fVal || (f === "All" && !filter);
              return (
                <Link
                  key={f}
                  href={`/lab/${section}${fVal ? `?filter=${fVal}` : ""}`}
                  className={`filter-pill${isActive ? " active" : ""}`}
                  prefetch={false}
                >
                  {f}
                </Link>
              );
            })}
          </div>
          {/* Cards */}
          {entries.map((e) => {
            const entryViews = viewsMap.get(e.id) || 0;
            return (
            <Link key={e.id} href={`/lab/${section}/${e.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div className="pub-card">
                <span className="pub-type">{e.type}</span>
                <span className="pub-title">{e.title || "Untitled"}</span>
                <span className="pub-views">
                  {entryViews > 0 ? `${entryViews} views` : `${e.word_count ?? 0}w`}
                </span>
                <span className="pub-edit">Edit ↗</span>
              </div>
            </Link>
            );
          })}
          {entries.length === 0 && (
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textAlign: "center", padding: "3rem 0" }}>{meta.emptyText}</div>
          )}
        </div>
      </div>
    );
  }

  /* ── IDEAS WALL ─────────────────────────────────────── */
  if (section === "ideas") {
    const RIPENESS_TABS = [
      { label: "All",         value: "" },
      { label: "Seed 🌱",     value: "seed" },
      { label: "Sprout 🌿",   value: "sprout" },
      { label: "Ripe 🍎",     value: "ripe" },
      { label: "Published ↗", value: "published" },
    ];

    // Filter by ripeness tag client-side (server-side: tags @> ARRAY[ripeness])
    const filteredIdeas = ripeness
      ? entries.filter((e) => (e.tags as string[] | null)?.includes(ripeness))
      : entries;

    return (
      <div className="lab-main">
        <div className="ideas-view fade-in">
          <div className="feed-header">
            <div>
              <div className="feed-title">Ideas Wall</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
                {filteredIdeas.length}{ripeness ? ` ${ripeness}` : ""} idea{filteredIdeas.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="feed-controls">
              <button type="button" className="random-btn">⚄ Random</button>
              <form action={newAction}><button type="submit" className="btn btn-primary">+ Capture idea</button></form>
            </div>
          </div>
          {/* Quick add */}
          <form action={newAction} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input className="quick-input" placeholder="Quick idea capture — press Enter..." name="_quick" />
            <button type="submit" className="btn btn-primary">→</button>
          </form>
          {/* Ripeness tabs — URL-driven */}
          <div className="ripeness-tabs">
            {RIPENESS_TABS.map((t) => {
              const isActive = ripeness === t.value;
              return (
                <Link
                  key={t.value}
                  href={`/lab/ideas${t.value ? `?ripeness=${t.value}` : ""}`}
                  className={`rtab${isActive ? " active" : ""}`}
                  prefetch={false}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
          {/* Ideas grid */}
          <div className="ideas-grid">
            {filteredIdeas.map((e) => {
              const rip = (e.tags as string[] | null)?.find((t) => ["seed","sprout","ripe","published"].includes(t)) ?? "seed";
              return (
                <Link key={e.id} href={`/lab/${section}/${e.id}`} style={{ textDecoration: "none" }}>
                  <div className={`idea-card ic-${rip}`}>
                    <div className={`idea-ripeness rip-${rip === "published" ? "pub" : rip}`}>
                      {rip}
                    </div>
                    <div className="idea-text">{e.title || "Untitled"}</div>
                    <div className="idea-footer">
                      <span className="idea-date">{fmtFull(e.created_at)}</span>
                      <PromoteButton id={e.id} initialRipeness={rip} />
                    </div>
                  </div>
                </Link>
              );
            })}
            {entries.length === 0 && (
              <div style={{ gridColumn: "1/-1", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textAlign: "center", padding: "3rem 0" }}>
                {meta.emptyText}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── READING LIST ────────────────────────────────────── */
  if (section === "reading") {
    const STATUS_TABS = ["All", "Reading", "Done", "Want to read"];
    const COVER_EMOJIS = ["📖","📚","📰","🗞️","📄","📝"];
    return (
      <div className="lab-main">
        <div className="reading-view fade-in">
          <div className="feed-header">
            <div>
              <div className="feed-title">Reading List</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{entries.length} items</div>
            </div>
            <div className="feed-controls">
              <form action={newAction}><button type="submit" className="btn btn-primary">+ Add item</button></form>
            </div>
          </div>
          {/* Status tabs */}
          <div className="reading-status-tabs">
            {STATUS_TABS.map((t, i) => (
              <button key={t} type="button" className={`rtab${i === 0 ? " active" : ""}`}>{t}</button>
            ))}
          </div>
          {/* Cards */}
          {entries.map((e, idx) => {
            const statusTag = (e.tags as string[] | null)?.find((t) => ["reading","done","want"].includes(t));
            const statusClass = statusTag === "done" ? "rs-done" : statusTag === "reading" ? "rs-reading" : "rs-want";
            const statusLabel = statusTag === "done" ? "Done" : statusTag === "reading" ? "Reading" : "Want to read";
            return (
              <Link key={e.id} href={`/lab/${section}/${e.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div className="reading-card">
                  <div className="rc-cover">{COVER_EMOJIS[idx % COVER_EMOJIS.length]}</div>
                  <div className="rc-body">
                    <div className="rc-title">{e.title || "Untitled"}</div>
                    <div className="rc-domain">{fmtFull(e.created_at)}</div>
                  </div>
                  <span className={`rc-status ${statusClass}`}>{statusLabel}</span>
                </div>
              </Link>
            );
          })}
          {entries.length === 0 && (
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textAlign: "center", padding: "3rem 0" }}>{meta.emptyText}</div>
          )}
        </div>
      </div>
    );
  }

  /* ── RESEARCH ────────────────────────────────────────── */
  if (section === "research") {
    return (
      <div className="lab-main">
        <div className="research-view fade-in">
          <div className="feed-header">
            <div>
              <div className="feed-title">Research</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{entries.length} papers & notes</div>
            </div>
            <div className="feed-controls">
              <form action={newAction}><button type="submit" className="btn btn-primary">+ New note</button></form>
            </div>
          </div>
          {/* Upload zone — client component */}
          <ResearchUploadZone onImport={importResearchEntry} />
          {/* Filter pills */}
          <div className="filter-pills">
            {meta.filters.map((f) => {
              const fVal = f === "All" ? "" : f.toLowerCase();
              const isActive = filter === fVal || (f === "All" && !filter);
              return (
                <Link
                  key={f}
                  href={`/lab/${section}${fVal ? `?filter=${fVal}` : ""}`}
                  className={`filter-pill${isActive ? " active" : ""}`}
                  prefetch={false}
                >
                  {f}
                </Link>
              );
            })}
          </div>
          {/* Paper cards */}
          {entries.map((e) => (
            <Link key={e.id} href={`/lab/${section}/${e.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div className="paper-card">
                <div>
                  <div className="pc-title">{e.title || "Untitled"}</div>
                  <div className="pc-authors" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
                    {fmtFull(e.created_at)}
                  </div>
                  <div className="pc-venue">
                    <span className="pc-venue-tag">{e.type}</span>
                    {(e.word_count ?? 0) > 0 && <span className="pc-year">{e.word_count}w</span>}
                  </div>
                  {e.content && (
                    <div className="pc-abstract">
                      {String(e.content).replace(/<[^>]*>/g, "").slice(0, 160)}…
                    </div>
                  )}
                </div>
                <div className="pc-actions">
                  <button type="button" className="pc-btn primary">Read ↗</button>
                  <button type="button" className="pc-btn">Annotate</button>
                  <button type="button" className="pc-btn">Breakdown</button>
                </div>
              </div>
            </Link>
          ))}
          {entries.length === 0 && (
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textAlign: "center", padding: "3rem 0" }}>{meta.emptyText}</div>
          )}
        </div>
      </div>
    );
  }

  /* ── DIARY FEED (default) ───────────────────────────── */
  const FILTER_PILLS = ["All", "Log", "Reflection", "Experiment", "Breakthrough", "Private", "Public"];
  return (
    <div className="lab-main">
      <div className="feed-view fade-in">
        {/* Header */}
        <div className="feed-header">
          <div>
            <div className="feed-title">{meta.label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
              {entries.length} entries
            </div>
          </div>
          <div className="feed-controls">
            <form action={newAction}>
              <button type="submit" className="btn btn-primary">+ New entry</button>
            </form>
          </div>
        </div>
        {/* Search */}
        <form method="GET" className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="search-input" name="q" defaultValue={q} placeholder="Search entries..." />
        </form>
        {/* Filter pills */}
        <div className="filter-pills">
          {FILTER_PILLS.map((f) => {
            const fVal = f === "All" ? "" : f.toLowerCase();
            const isActive = filter === fVal || (f === "All" && !filter);
            return (
              <Link
                key={f}
                href={`/lab/${section}${fVal ? `?filter=${fVal}` : ""}`}
                className={`filter-pill${isActive ? " active" : ""}`}
                prefetch={false}
              >
                {f}
              </Link>
            );
          })}
        </div>
        {/* Entry list */}
        {entries.length > 0 ? (
          entries.map((entry) => {
            const typeClass = TYPE_CLASS[entry.type] ?? "t-log";
            const moodDot   = MOOD_COLOR[entry.mood ?? ""] ?? "var(--border2)";
            const excerpt   = (entry.content ?? "").toString().replace(/<[^>]*>/g, "").slice(0, 120);
            return (
              <Link key={entry.id} href={`/lab/${section}/${entry.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div className="entry-card">
                  <div className="ec-date">
                    <div className="ec-day">{fmtDay(entry.created_at)}</div>
                    <div className="ec-mon">{fmtMon(entry.created_at)}</div>
                  </div>
                  <div>
                    <div className="ec-type-row">
                      <span className={`ec-type ${typeClass}`}>{entry.type}</span>
                      <span className="mood-dot" style={{ background: moodDot }} />
                    </div>
                    <div className="ec-title">{entry.title || "Untitled"}</div>
                    {excerpt && <div className="ec-excerpt">{excerpt}…</div>}
                    <div className="ec-meta">
                      {(entry.word_count ?? 0) > 0 && <span className="ec-wc">{entry.word_count}w</span>}
                      {(entry.tags as string[] | null)?.length ? (
                        <div className="ec-tags">
                          {(entry.tags as string[]).slice(0, 3).map((t) => (
                            <span key={t} className="ec-tag">#{t}</span>
                          ))}
                        </div>
                      ) : null}
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
              {meta.emptyText}
            </div>
            <form action={newAction}>
              <button type="submit" className="btn btn-primary">Write first entry</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
