import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SECTION_TYPE_MAP } from "../../constants";


export default async function NewEntryPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!SECTION_TYPE_MAP[section]) notFound();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const type = SECTION_TYPE_MAP[section];

  const { data, error } = await supabase
    .from("lab_entries")
    .insert({ user_id: user.id, type, title: "", content: {}, tags: [] })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[NewEntryPage] insert failed:", error?.message);
    redirect(`/lab/${section}`);
  }

  redirect(`/lab/${section}/${data.id}`);
}
