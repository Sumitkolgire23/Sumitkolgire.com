import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { withAnthropicRetry } from "@/lib/retry";

// Initialize Anthropic client safely
const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

// Dynamic fallback generation based on seed content
const generateFallback = (seedContent: string) => {
  const clean = seedContent.trim();
  const shortTitle = clean.length > 30 ? clean.substring(0, 30) + "..." : clean;
  return {
    outline: [
      `Introduction to the concept of "${shortTitle}"`,
      "Core principles and key mechanisms",
      "Practical applications and real-world impact",
      "Common challenges, critiques, and limitations",
      "Future outlook, open questions, and conclusion"
    ],
    angles: [
      `The practical dimension: How to implement "${shortTitle}" in everyday workflows.`,
      `The theoretical perspective: Examining the underlying philosophical assumptions of "${shortTitle}".`,
      `The critical lens: Questioning the long-term sustainability and systemic impact of "${shortTitle}".`
    ],
    concepts: [
      "Innovation strategy",
      "Conceptual frameworks",
      "System design",
      "Future paradigms",
      "Creative implementation"
    ],
    titles: [
      `Understanding "${shortTitle}": A New Perspective`,
      `The Future of "${shortTitle}": Challenges and Opportunities`,
      `Beyond the Surface: A Deep Dive into "${shortTitle}"`
    ]
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Missing content in request body" }, { status: 400 });
    }

    if (!anthropic) {
      console.log("[expand-idea] Anthropic key missing, returning structured fallbacks.");
      return NextResponse.json(generateFallback(content));
    }

    try {
      const response = await withAnthropicRetry(() => anthropic!.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1000,
        temperature: 0.7,
        system: `You are an expert creative assistant. Expand the user's seedling idea into:
1. A 5-section essay outline (array of strings, exactly 5 items).
2. 3 alternative angles or perspectives to approach the topic (array of strings, exactly 3 items).
3. 5 related concepts (array of strings, exactly 5 items).
4. 3 suggested titles (array of strings, exactly 3 items).

You MUST return ONLY a valid JSON object matching the following structure:
{
  "outline": ["...", "...", "...", "...", "..."],
  "angles": ["...", "...", "..."],
  "concepts": ["...", "...", "...", "...", "..."],
  "titles": ["...", "...", "..."]
}

Do not include any explanation, intro text, markdown code blocks (e.g. no \`\`\`json tags), or extra symbols. Return pure valid JSON.`,
        messages: [
          {
            role: "user",
            content: `Expand this seedling idea:\n\n${content}`
          }
        ]
      }));

      const textOutput = response.content[0].type === "text" ? response.content[0].text.trim() : "";
      
      // Clean up markdown block wraps if Claude mistakenly added them
      const cleanJson = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
      
      try {
        const parsedData = JSON.parse(cleanJson);
        // Basic validation of schema structure
        if (
          parsedData &&
          Array.isArray(parsedData.outline) &&
          Array.isArray(parsedData.angles) &&
          Array.isArray(parsedData.concepts) &&
          Array.isArray(parsedData.titles)
        ) {
          return NextResponse.json(parsedData);
        } else {
          console.warn("[expand-idea] Parsed JSON does not match expected schema:", parsedData);
        }
      } catch (jsonErr) {
        console.warn("[expand-idea] Failed to parse Claude JSON output:", textOutput, jsonErr);
      }
    } catch (apiErr) {
      console.warn("[expand-idea] Claude API request failed:", apiErr);
    }

    // Return fallback if Claude call fails or output is malformed
    return NextResponse.json(generateFallback(content));
  } catch (err: any) {
    console.error("Expand Idea API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
