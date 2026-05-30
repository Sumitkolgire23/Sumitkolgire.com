import { NextResponse } from "next/server";
import { _getPublicDiaryWordCount, _getDiaryStreak } from "@/lib/public-data";
import { getProjects } from "@/lib/velite";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [wordCount, streak] = await Promise.all([
      _getPublicDiaryWordCount(),
      _getDiaryStreak(),
    ]);

    const activeProjects = getProjects().filter(
      (p) => p.projectStatus === "active" || p.projectStatus === "experimental"
    );

    return NextResponse.json({
      wordCount,
      streak,
      projectCount: activeProjects.length,
    });
  } catch (err) {
    console.error("[Stats API Error]", err);
    return NextResponse.json({
      wordCount: 0,
      streak: 0,
      projectCount: 0,
    });
  }
}
