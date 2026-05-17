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

    const { error } = await supabase
      .from("lab_entries")
      .update({
        title:      payload.title      ?? "",
        content:    payload.content    ?? {},
        tags:       payload.tags       ?? [],
        word_count: payload.wordCount  ?? 0,
      })
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

/** Update visibility / type from the metadata panel */
export async function updateLabEntryMeta(
  id: string,
  payload: { visibility?: string; type?: string; pinned?: boolean }
): Promise<{ ok: boolean }> {
  try {
    const { supabase, user } = await getAuthClient();
    await supabase
      .from("lab_entries")
      .update(payload)
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
