"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { SECTION_TYPE_MAP } from "./constants";

async function getAuthClient() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return { supabase, user };
}

/** Create a blank entry and return its ID */
export async function createLabEntry(section: string): Promise<{ id: string } | { error: string }> {
  try {
    const { supabase, user } = await getAuthClient();
    const type = SECTION_TYPE_MAP[section] ?? "log";

    const { data, error } = await supabase
      .from("lab_entries")
      .insert({ user_id: user.id, type, title: "", content: {}, tags: [] })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[createLabEntry]", error?.message);
      return { error: "Failed to create entry." };
    }
    return { id: data.id };
  } catch {
    return { error: "Unauthorized" };
  }
}

/** Import an external paper (e.g., from arXiv) */
export async function importResearchEntry(payload: {
  title: string;
  url?: string;
  type: "pdf" | "arxiv";
}): Promise<{ id: string } | { error: string }> {
  try {
    const { supabase, user } = await getAuthClient();

    const { data, error } = await supabase
      .from("lab_entries")
      .insert({
        user_id: user.id,
        type: "research",
        title: payload.title,
        content: payload.url ? { source_url: payload.url, import_type: payload.type } : { import_type: payload.type },
        tags: [payload.type],
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[importResearchEntry]", error?.message);
      return { error: "Failed to import entry." };
    }
    
    revalidatePath("/lab/research");
    return { id: data.id };
  } catch {
    return { error: "Unauthorized" };
  }
}

/** Autosave — called from the client editor */
export async function saveLabEntry(
  id: string,
  payload: { title?: string; content?: object; tags?: string[]; wordCount?: number }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { supabase, user } = await getAuthClient();

    // Build a partial update — only include fields that were explicitly provided.
    // This prevents an autosave from clobbering tags managed by MetadataPanel.
    const update: Record<string, unknown> = {};
    if (payload.title    !== undefined) update.title      = payload.title;
    if (payload.content  !== undefined) update.content    = payload.content;
    if (payload.tags     !== undefined) update.tags       = payload.tags;
    if (payload.wordCount !== undefined) update.word_count = payload.wordCount;

    if (Object.keys(update).length === 0) return { ok: true };

    const { error } = await supabase
      .from("lab_entries")
      .update(update)
      .eq("id", id)
      .eq("user_id", user.id);   // extra RLS guard

    if (error) {
      console.error("[saveLabEntry]", error.message);
      return { ok: false, error: error.message };
    }

    revalidatePath("/lab");
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

/** Update visibility / type / mood / tags from the metadata panel */
export async function updateLabEntryMeta(
  id: string,
  payload: {
    visibility?: string;
    type?: string;
    mood?: string;
    pinned?: boolean;
    tags?: string[];
  }
): Promise<{ ok: boolean }> {
  try {
    const { supabase, user } = await getAuthClient();

    // Whitelist every field explicitly — never pass raw client payload to update().
    // This prevents mass-assignment (e.g. a client sending { user_id: '...' }).
    const ALLOWED_VISIBILITY = ["private", "public", "unlisted"] as const;
    const ALLOWED_TYPES = ["log", "reflection", "experiment", "breakthrough", "research", "idea", "reference", "decision"] as const;
    const ALLOWED_MOODS = ["stillness", "chaos", "breakthrough", "reflection", ""] as const;

    const safe: Record<string, unknown> = {};

    if (payload.visibility !== undefined) {
      if (!ALLOWED_VISIBILITY.includes(payload.visibility as typeof ALLOWED_VISIBILITY[number])) {
        return { ok: false };
      }
      safe.visibility = payload.visibility;
    }
    if (payload.type !== undefined) {
      if (!ALLOWED_TYPES.includes(payload.type as typeof ALLOWED_TYPES[number])) {
        return { ok: false };
      }
      safe.type = payload.type;
    }
    if (payload.mood !== undefined) {
      if (!ALLOWED_MOODS.includes(payload.mood as typeof ALLOWED_MOODS[number])) {
        return { ok: false };
      }
      safe.mood = payload.mood;
    }
    if (payload.pinned !== undefined) {
      safe.pinned = Boolean(payload.pinned);
    }
    if (payload.tags !== undefined) {
      // Sanitize tags: lowercase strings, no special chars, max 20 tags, max 32 chars each
      safe.tags = (Array.isArray(payload.tags) ? payload.tags : [])
        .slice(0, 20)
        .map((t) => String(t).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32))
        .filter(Boolean);
    }

    if (Object.keys(safe).length === 0) return { ok: true };

    await supabase
      .from("lab_entries")
      .update(safe)
      .eq("id", id)
      .eq("user_id", user.id);

    revalidatePath("/lab");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Soft-delete */
export async function deleteLabEntry(id: string): Promise<{ ok: boolean }> {
  try {
    const { supabase, user } = await getAuthClient();
    await supabase
      .from("lab_entries")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    revalidatePath("/lab");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Ripeness ladder for the Ideas Wall */
const RIPENESS_LADDER = ["seed", "sprout", "ripe", "published"] as const;
type Ripeness = (typeof RIPENESS_LADDER)[number];

/**
 * Promote an idea to the next ripeness level.
 * Returns { nextRipeness } on success so the client can update optimistically.
 */
export async function promoteIdea(
  id: string,
  currentRipeness: string,
): Promise<{ nextRipeness: Ripeness } | { error: string }> {
  try {
    const { supabase, user } = await getAuthClient();

    const currentIdx = RIPENESS_LADDER.indexOf(currentRipeness as Ripeness);
    if (currentIdx === -1 || currentIdx === RIPENESS_LADDER.length - 1) {
      return { error: "Already at max ripeness." };
    }
    const nextRipeness = RIPENESS_LADDER[currentIdx + 1];

    // Fetch current tags so we only swap out the ripeness tag, preserving others
    const { data: entry, error: fetchError } = await supabase
      .from("lab_entries")
      .select("tags")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !entry) return { error: "Entry not found." };

    const existingTags: string[] = Array.isArray(entry.tags) ? entry.tags : [];
    const updatedTags = [
      ...existingTags.filter((t) => !RIPENESS_LADDER.includes(t as Ripeness)),
      nextRipeness,
    ];

    const { error: updateError } = await supabase
      .from("lab_entries")
      .update({ tags: updatedTags })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[promoteIdea]", updateError.message);
      return { error: "Failed to promote idea." };
    }

    revalidatePath("/lab/ideas");
    return { nextRipeness };
  } catch {
    return { error: "Unauthorized" };
  }
}

/** Fetch arXiv metadata server-side to avoid CORS issues */
export async function fetchArxivMetadata(id: string): Promise<{ title: string; url: string; error?: string }> {
  try {
    // Only authenticated users can trigger fetches via this action
    await getAuthClient();

    const res = await fetch(`https://export.arxiv.org/abs/${id}`);
    if (!res.ok) throw new Error(`arXiv responded with ${res.status}`);
    const html = await res.text();
    
    // Extract title
    const titleMatch = html.match(/<h1 class="title[^"]*">\s*<span[^>]*>[^<]*<\/span>\s*([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].trim() : `arXiv:${id}`;

    return { title, url: `https://arxiv.org/abs/${id}` };
  } catch (error) {
    console.error("[fetchArxivMetadata]", error);
    return { title: "", url: "", error: "Could not fetch arXiv metadata. Check the ID." };
  }
}
