import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createLabEntry } from "@/app/(site)/(private)/lab/actions";

const SECTIONS = [
  { key: "diary",     label: "Daily Diary",    icon: "✎", desc: "Thoughts, reflections, daily logs",    type: "log" },
  { key: "research",  label: "Research",        icon: "◈", desc: "Long-form notes & paper breakdowns",  type: "research" },
  { key: "ideas",     label: "Ideas Wall",      icon: "✦", desc: "Seeds of thought, half-baked plans",  type: "idea" },
  { key: "reading",   label: "Reading List",    icon: "≡", desc: "Articles, books, links with notes",   type: "reference" },
  { key: "projects",  label: "Projects",        icon: "⬡", desc: "Per-project scratchpads",             type: "experiment" },
  { key: "published", label: "Published",       icon: "↗", desc: "What's live on the public site",      type: null },
];

function getToday() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default async function LabDashboard() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  // Stats
  const { data: allEntries } = await supabase
    .from("lab_entries")
    .select("id, type, word_count, created_at, updated_at, title, tags, visibility")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const entries = allEntries ?? [];
  const totalWords = entries.reduce((sum, e) => sum + (e.word_count ?? 0), 0);

  // Today's entries
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayEntries = entries.filter(e => new Date(e.created_at) >= today);
  const todayWords = todayEntries.reduce((sum, e) => sum + (e.word_count ?? 0), 0);

  // Count per section
  const countByType: Record<string, number> = {};
  entries.forEach(e => { countByType[e.type] = (countByType[e.type] ?? 0) + 1; });

  // Recent 6
  const recent = entries.slice(0, 6);

  const TYPE_TO_SECTION: Record<string, string> = {
    log: "diary", research: "research", idea: "ideas",
    reference: "reading", experiment: "projects",
  };

  const PILL_COLORS: Record<string, { color: string; bg: string }> = {
    log:        { color: "var(--muted)",  bg: "var(--paper-3)" },
    research:   { color: "var(--teal)",   bg: "rgba(13,148,136,.08)" },
    idea:       { color: "var(--gold)",   bg: "rgba(139,115,85,.08)" },
    reference:  { color: "var(--moss)",   bg: "rgba(45,106,79,.08)" },
    experiment: { color: "var(--seal)",   bg: "rgba(196,30,58,.06)" },
  };

  return (
    <>
      {/* Top bar */}
      <div className="lab-topbar">
        <span className="lab-topbar-title" style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink)" }}>
          {getToday()}
        </span>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--ghost)" }}>
          {user?.email}
        </div>
      </div>

      <div style={{ padding: "3rem 3rem", maxWidth: 960, animation: "fadeIn 0.6s ease-out forwards" }}>

        {/* Greeting */}
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.25rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            研究室
          </h1>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em" }}>
            Your private thinking lab · {entries.length} entries
          </p>
        </div>

        {/* Stats row */}
        <div className="lab-dashboard-stats">
          {[
            { label: "Total Entries", value: entries.length, accent: false },
            { label: "Total Words", value: totalWords.toLocaleString(), accent: false },
            { label: "Today", value: `${todayEntries.length} entries · ${todayWords}w`, accent: true },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "2.5rem", fontWeight: 700, color: s.accent ? "var(--seal)" : "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ghost)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section grid */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--ink-faint)" }}>
            Workspace Sections
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {SECTIONS.map((sec, i) => (
              <Link key={sec.key} href={`/lab/${sec.key}`} style={{ textDecoration: "none", animationDelay: `${i * 0.05}s`, animation: "fadeIn 0.5s ease-out backwards" }}>
                <div style={{ background: "var(--paper-2)", border: "1px solid var(--ink-faint)", padding: "1.5rem 1.25rem", transition: "all 0.3s ease", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--seal)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(28,26,21,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--ink-faint)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{sec.icon}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.25rem" }}>{sec.label}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "0.75rem" }}>{sec.desc}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--ghost)" }}>
                    {sec.type ? (countByType[sec.type] ?? 0) : entries.filter(e => e.visibility === "public").length} entries
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent entries */}
        {recent.length > 0 && (
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--ink-faint)" }}>
              Recent Entries
            </div>
            {recent.map((entry, i) => {
              const pill = PILL_COLORS[entry.type] ?? PILL_COLORS.log;
              const section = TYPE_TO_SECTION[entry.type] ?? "diary";
              return (
                <Link key={entry.id} href={`/lab/${section}/${entry.id}`} style={{ textDecoration: "none", display: "block", animationDelay: `${i * 0.06}s` }}>
                  <div className="entry-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.18rem 0.5rem", color: pill.color, background: pill.bg, border: `1px solid ${pill.color}22` }}>
                        {entry.type}
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--ghost)" }}>
                        {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      {entry.word_count > 0 && (
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--ghost)", marginLeft: "auto" }}>
                          {entry.word_count}w
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700, color: "var(--ink)" }}>
                      {entry.title || "Untitled"}
                    </div>
                    {entry.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                        {entry.tags.slice(0, 4).map((t: string) => (
                          <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--muted)" }}>#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {entries.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 2rem", border: "1px dashed var(--ink-faint)", background: "var(--paper-2)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.3 }}>✎</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", color: "var(--muted)", marginBottom: "0.5rem", fontStyle: "italic" }}>
              The notebook is empty.
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--ghost)", marginBottom: "2rem" }}>
              Begin your first entry — pick a section to start writing.
            </div>
          </div>
        )}

      </div>
    </>
  );
}
