import { NextRequest, NextResponse } from "next/server";
import { generateDiarySummary } from "@/lib/ai-helper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Missing content parameter in request body" }, { status: 400 });
    }

    const summary = await generateDiarySummary(content);
    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("Diary summary API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
