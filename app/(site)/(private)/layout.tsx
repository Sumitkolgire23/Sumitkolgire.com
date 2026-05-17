import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { LabNav } from "@/components/lab/LabNav";
import { LabTopBar } from "@/components/lab/LabTopBar";
import { calculateStreak, computeHeatmap } from "./utils";
import "@/app/lab.css";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "SK";

  let streak = 0;
  let heatmapLevels: number[] = Array(20).fill(0);
  if (user) {
    const { data } = await supabase
      .from("lab_entries")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) {
      const dates = data.map(d => d.created_at);
      streak = calculateStreak(dates);
      heatmapLevels = computeHeatmap(dates);
    }
  }

  return (
    /*
      Grid: 220px (nav) | 1fr (main) | 260px (right panel)
      Row 1: topbar spans all 3 columns (grid-column: 1/-1 in CSS)
      Row 2: nav | children fragment | (right panel child if present)

      The editor page renders a React fragment <>editor + MetadataPanel</>.
      Since children is a fragment, both elements are direct children of
      lab-shell and fall into columns 2 and 3 naturally in CSS grid.
    */
    <div className="lab-shell">
      <LabTopBar userInitial={initials} streak={streak} />
      <LabNav userEmail={user?.email} streak={streak} heatmapLevels={heatmapLevels} />
      {children}
    </div>
  );
}
