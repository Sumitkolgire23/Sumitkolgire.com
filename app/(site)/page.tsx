import type { Metadata } from "next";
import { getArticles, getProjects } from "@/lib/velite";
import {
  getPublicDiaryEntries,
  getDiaryStreak,
  getPublicIdeas,
  getIdeasStats,
} from "@/lib/public-data";
import { computeHeatmap } from "@/app/(site)/(private)/utils";

// ── Section components ─────────────────────────────────────
import { HomeHero }       from "@/components/home/HomeHero";
import { HomeStatsBar }   from "@/components/home/HomeStatsBar";
import { HomeTicker }     from "@/components/home/HomeTicker";
import { HomeWriting }    from "@/components/home/HomeWriting";
import { HomeDiary }      from "@/components/home/HomeDiary";
import { HomeProjects }   from "@/components/home/HomeProjects";
import { HomeIdeas }      from "@/components/home/HomeIdeas";
import { HomeObsession }  from "@/components/home/HomeObsession";
import { HomeNewsletter } from "@/components/home/HomeNewsletter";

export const metadata: Metadata = {
  title: "Sumit Kolgire — AI/ML Engineer",
  description:
    "AI/ML engineer in the making. Building intelligent systems: NOVELMAN, Ryuu AI OS, GrowthMate. Articles, research notes, and raw ideas — a living lab.",
};

export default async function HomePage() {
  // ── Velite (static, build-time) ───────────────────────
  const allArticles  = getArticles().slice(0, 5);
  const allProjects  = getProjects()
    .filter(p => p.projectStatus === "active" || p.projectStatus === "experimental")
    .slice(0, 5);

  // ── Supabase (dynamic, request-time) ─────────────────
  const [diaryEntries, streak, ideas, ideasStats] = await Promise.all([
    getPublicDiaryEntries(4),
    getDiaryStreak(),
    getPublicIdeas(4),
    getIdeasStats(),
  ]);

  // Heatmap from last 182 days of diary entries
  const allDiaryDates = diaryEntries.map(e => e.written_at);
  const heatmapLevels = computeHeatmap(allDiaryDates, 182);

  return (
    <>
      <HomeHero />
      <HomeStatsBar streak={streak} />
      <HomeTicker />
      <HomeWriting articles={allArticles} />
      <HomeDiary
        entries={diaryEntries}
        streak={streak}
        heatmapLevels={heatmapLevels}
      />
      <HomeProjects projects={allProjects} />
      <HomeIdeas ideas={ideas} stats={ideasStats} />
      <HomeObsession />
      <HomeNewsletter />
    </>
  );
}
