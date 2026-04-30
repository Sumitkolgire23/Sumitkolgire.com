"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export const SECTION_TYPE_MAP: Record<string, string> = {
  diary:    "log",
  research: "research",
  ideas:    "idea",
  reading:  "reference",
  projects: "experiment",
};

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
