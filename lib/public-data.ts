import { createServerClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client with no cookie handling.
 * Safe to use in public Server Components — reads only public rows.
 * RLS policies must have is_public = true for rows to be visible.
 */
export function createPublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[createPublicClient] Supabase credentials missing");
    return null;
  }
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

async function _getPublicDiaryEntries(limit: number): Promise<PublicDiaryEntry[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
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
  } catch (err) {
    console.error("[getPublicDiaryEntries] Network error:", err);
    return [];
  }
}

/** Cached: revalidates every 5 minutes. Tag: "diary" */
export const getPublicDiaryEntries = unstable_cache(
  (limit = 4) => _getPublicDiaryEntries(limit),
  ["public-diary-entries"],
  { revalidate: 300, tags: ["diary"] }
);

async function _getDiaryStreak(): Promise<number> {
  const supabase = createPublicClient();
  if (!supabase) return 0;

  try {
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
  } catch (err) {
    console.error("[getDiaryStreak] Network error:", err);
    return 0;
  }
}

/** Cached: revalidates every 5 minutes. Tag: "diary" */
export const getDiaryStreak = unstable_cache(
  () => _getDiaryStreak(),
  ["diary-streak"],
  { revalidate: 300, tags: ["diary"] }
);

/**
 * calculateStreak — single source of truth (L-10 deduplication fix).
 * Shared by public-data.ts and any private utils that need it.
 */
export function calculateStreak(dates: string[]): number {
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

async function _getPublicIdeas(limit: number): Promise<PublicIdea[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
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
  } catch (err) {
    console.error("[getPublicIdeas] Network error:", err);
    return [];
  }
}

/** Cached: revalidates every 5 minutes. Tag: "ideas" */
export const getPublicIdeas = unstable_cache(
  (limit = 4) => _getPublicIdeas(limit),
  ["public-ideas"],
  { revalidate: 300, tags: ["ideas"] }
);

async function _getIdeasStats(): Promise<{ total: number; ripe: number }> {
  const supabase = createPublicClient();
  if (!supabase) return { total: 0, ripe: 0 };

  try {
    const { data, error } = await supabase
      .from("ideas")
      .select("ripeness")
      .eq("is_public", true);

    if (error || !data) return { total: 0, ripe: 0 };
    return {
      total: data.length,
      ripe: data.filter((r) => r.ripeness === "ripe" || r.ripeness === "published").length,
    };
  } catch (err) {
    console.error("[getIdeasStats] Network error:", err);
    return { total: 0, ripe: 0 };
  }
}

/** Cached: revalidates every 5 minutes. Tag: "ideas" */
export const getIdeasStats = unstable_cache(
  () => _getIdeasStats(),
  ["ideas-stats"],
  { revalidate: 300, tags: ["ideas"] }
);

// ── Resources (is_public = true) ─────────────────────────────────────────

export type PublicResource = {
  id: string;
  title: string;
  url: string;
  note: string | null;
  domain: string | null;
  type: string | null;
  created_at: string;
};

async function _getPublicResources(): Promise<PublicResource[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("resources")
      // RED TEAM AUDIT NOTE [L-9]: The `type` column is queried here but does not exist
      // in the Drizzle schema (`db/schema.ts`). Ensure Supabase table has this column.
      .select("id, title, url, note, domain, type, created_at")
      .eq("is_public", true)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getPublicResources]", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[getPublicResources] Network error:", err);
    return [];
  }
}

/** Cached: revalidates every hour. Resources change infrequently. Tag: "resources" */
export const getPublicResources = unstable_cache(
  () => _getPublicResources(),
  ["public-resources"],
  { revalidate: 3600, tags: ["resources"] }
);

