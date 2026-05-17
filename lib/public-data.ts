import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client with no cookie handling.
 * Safe to use in public Server Components — reads only public rows.
 * RLS policies must have is_public = true for rows to be visible.
 */
export function createPublicClient() {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

// ── Diary entries (is_public = true) ─────────────────────────────────────

export type PublicDiaryEntry = {
  id: string;
  mood: string | null;
  content: string;
  written_at: string;
  word_count: number;
};

export async function getPublicDiaryEntries(limit = 4): Promise<PublicDiaryEntry[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("diary_entries")
    .select("id, mood, content, written_at, word_count")
    .eq("is_public", true)
    .is("deleted_at", null)
    .order("written_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getPublicDiaryEntries]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getDiaryStreak(): Promise<number> {
  const supabase = createPublicClient();
  // Fetch the last 60 days of public entry dates for streak calculation
  const since = new Date();
  since.setDate(since.getDate() - 60);
  const { data, error } = await supabase
    .from("diary_entries")
    .select("written_at")
    .eq("is_public", true)
    .is("deleted_at", null)
    .gte("written_at", since.toISOString())
    .order("written_at", { ascending: false });

  if (error || !data) return 0;

  const dates = data.map((r) => r.written_at as string);
  return calculateStreak(dates);
}

function calculateStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const uniqueDates = Array.from(
    new Set(dates.map((d) => new Date(d).toLocaleDateString("en-CA")))
  ).sort((a, b) => b.localeCompare(a));

  const today = new Date().toLocaleDateString("en-CA");
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toLocaleDateString("en-CA");

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 0;
  const checkDate = new Date(uniqueDates[0]);
  for (const dateStr of uniqueDates) {
    const checkDateStr = checkDate.toLocaleDateString("en-CA");
    if (dateStr === checkDateStr) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else break;
  }
  return streak;
}

// ── Ideas (is_public = true) ──────────────────────────────────────────────

export type PublicIdea = {
  id: string;
  content: string;
  ripeness: string;
  planted_at: string;
  tags: string[];
};

export async function getPublicIdeas(limit = 4): Promise<PublicIdea[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("ideas")
    .select("id, content, ripeness, planted_at, tags")
    .eq("is_public", true)
    .order("planted_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getPublicIdeas]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getIdeasStats(): Promise<{ total: number; ripe: number }> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("ideas")
    .select("ripeness")
    .eq("is_public", true);

  if (error || !data) return { total: 0, ripe: 0 };
  return {
    total: data.length,
    ripe: data.filter((r) => r.ripeness === "ripe" || r.ripeness === "published").length,
  };
}
