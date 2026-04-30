"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createDiaryEntry(prevState: { error: string } | undefined, formData: FormData) {
  const content = formData.get("content") as string;
  const mood = formData.get("mood") as string;
  const isPublic = formData.get("isPublic") === "on";

  if (!content) {
    return { error: "Content is required." };
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;

  const { error } = await supabase.from("diary_entries").insert({
    user_id: user.id,
    content,
    mood: mood || "reflection",
    is_public: isPublic,
    word_count: wordCount,
    written_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Insert error:", error.message);
    return { error: "Failed to save entry." };
  }

  revalidatePath("/lab-diary");
  return { error: "" };
}
