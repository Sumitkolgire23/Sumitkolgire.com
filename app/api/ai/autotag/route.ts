import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAllTags } from "@/lib/velite";

// Initialize Anthropic client safely
const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title && !content) {
      return NextResponse.json({ error: "Missing title or content in request body" }, { status: 400 });
    }

    const textToAnalyze = `${title || ""}\n${content || ""}`;
    const existingTags = getAllTags();

    // Deterministic fallback if API Key is missing or service is down
    const generateFallbackTags = (): string[] => {
      const matched: string[] = [];
      const lowerText = textToAnalyze.toLowerCase();
      
      existingTags.forEach((tag) => {
        // Look for whole-word matches of existing tags in the content
        const regex = new RegExp(`\\b${tag.toLowerCase()}\\b`, "i");
        if (regex.test(lowerText)) {
          matched.push(tag);
        }
      });

      // Default tags if nothing matched
      if (matched.length === 0) {
        if (lowerText.includes("stoic") || lowerText.includes("philosoph")) matched.push("philosophy");
        if (lowerText.includes("agent") || lowerText.includes("ai") || lowerText.includes("llm")) matched.push("ai");
        if (lowerText.includes("web") || lowerText.includes("react") || lowerText.includes("next")) matched.push("web");
        if (matched.length === 0) matched.push("general");
      }

      return matched.slice(0, 5);
    };

    if (!anthropic) {
      console.log("[autotag] Anthropic key missing, returning keyword-matched fallbacks.");
      return NextResponse.json({ tags: generateFallbackTags() });
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 60,
        temperature: 0.1,
        system: `You are Nirvana, Sumit's AI. Recommend exactly 3 to 5 tags for this post.
Select from the existing tags if they match well. Here is the list of existing tags: [${existingTags.join(", ")}].
If none of them match well, you can propose new, lowercase, single-word or hyphenated tags (e.g. 'agent-systems', 'wabi-sabi').
Return ONLY a valid JSON array of string tags, and absolutely nothing else. No markdown wrapping, no explanation. Example output: ["philosophy", "ai-engineering"]`,
        messages: [
          {
            role: "user",
            content: `Recommend tags for the following content:\nTitle: ${title || "Untitled"}\nContent:\n${textToAnalyze.substring(0, 3000)}`
          }
        ]
      });

      const textOutput = response.content[0].type === "text" ? response.content[0].text.trim() : "";
      
      // Clean up markdown block wraps if Claude mistakenly added them
      const cleanJson = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
      
      try {
        const parsedTags = JSON.parse(cleanJson);
        if (Array.isArray(parsedTags)) {
          return NextResponse.json({ tags: parsedTags });
        }
      } catch (jsonErr) {
        console.warn("[autotag] Failed to parse Claude JSON output:", textOutput, jsonErr);
      }
    } catch (apiErr) {
      console.warn("[autotag] Claude API request failed:", apiErr);
    }

    // Return fallback if Claude call fails or output is malformed
    return NextResponse.json({ tags: generateFallbackTags() });
  } catch (err: any) {
    console.error("Autotag API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
