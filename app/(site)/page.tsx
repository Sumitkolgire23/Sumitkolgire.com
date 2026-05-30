import type { Metadata } from "next";
import { getArticles, getProjects } from "@/lib/velite";
import {
  getPublicDiaryEntries,
  getDiaryStreak,
  getPublicIdeas,
  getIdeasStats,
  getPublicDiaryWordCount,
} from "@/lib/public-data";
import { computeHeatmap } from "@/app/(site)/(private)/utils";

// ── Section components ─────────────────────────────────────
import { HomeHero }       from "@/components/home/HomeHero";
import { HomeStatsBar }   from "@/components/home/HomeStatsBar";
import { HomeTicker }     from "@/components/home/HomeTicker";
import { HomeWriting }    from "@/components/home/HomeWriting";
import { HomeDiary }      from "@/components/home/HomeDiary";
import { HomeActivityFeed } from "@/components/home/HomeActivityFeed";
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
  const activeProjects = getProjects().filter(
    p => p.projectStatus === "active" || p.projectStatus === "experimental"
  );
  const projectsToShow = activeProjects.slice(0, 5);

  // ── Supabase (dynamic, request-time) ─────────────────
  const [diaryEntries, streak, ideas, ideasStats, totalWords] = await Promise.all([
    getPublicDiaryEntries(10), // Fetch up to 10 to gather enough activity logs
    getDiaryStreak(),
    getPublicIdeas(10),       // Fetch up to 10 to gather enough activity logs
    getIdeasStats(),
    getPublicDiaryWordCount(),
  ]);

  // Heatmap from last 182 days of diary entries
  const allDiaryDates = diaryEntries.map(e => e.written_at);
  const heatmapLevels = computeHeatmap(allDiaryDates, 182);

  // Format initial activity logs from diary & ideas database entries
  const diaryEvents = diaryEntries.map(entry => ({
    id: `diary-${entry.id}`,
    type: "diary" as const,
    timestamp: entry.written_at,
    text: `DIARY PUBLISHED: "${entry.content.substring(0, 50)}${entry.content.length > 50 ? "..." : ""}" (+${entry.word_count} words)`
  }));

  const ideaEvents = ideas.map(idea => ({
    id: `idea-${idea.id}`,
    type: "idea" as const,
    timestamp: idea.planted_at,
    text: `IDEA PLANTED: "${idea.content.substring(0, 50)}${idea.content.length > 50 ? "..." : ""}" (ripeness: ${idea.ripeness})`
  }));

  const initialEvents = [...diaryEvents, ...ideaEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  // Slice back down to original size for UI grid cards
  const diaryEntriesToShow = diaryEntries.slice(0, 4);

  return (
    <>
      <HomeHero />
      <HomeStatsBar streak={streak} projectCount={activeProjects.length} totalWords={totalWords} />
      <HomeTicker />
      <HomeWriting articles={allArticles} />
      <HomeDiary
        entries={diaryEntriesToShow}
        streak={streak}
        heatmapLevels={heatmapLevels}
      />
      <HomeActivityFeed initialCommits={[]} initialEvents={initialEvents} />
      <HomeProjects projects={projectsToShow} />
      <HomeIdeas ideas={ideas.slice(0, 4)} stats={ideasStats} />
      <HomeObsession />
      <HomeNewsletter />
    </>
  );
}
