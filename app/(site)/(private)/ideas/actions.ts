"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createIdea(prevState: { error: string } | undefined, formData: FormData) {
  const content = formData.get("content") as string;
  const isPublic = formData.get("isPublic") === "on";
  const rawTags = formData.get("tags") as string;

  if (!content) {
    return { error: "Content is required." };
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const tags = rawTags
    ? rawTags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
    : [];

  const { error } = await supabase.from("ideas").insert({
    user_id: user.id,
    content,
    ripeness: "seed",
    is_public: isPublic,
    tags,
    planted_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Insert error:", error.message);
    return { error: "Failed to save idea." };
  }

  revalidatePath("/ideas");
  return { error: "" };
}
