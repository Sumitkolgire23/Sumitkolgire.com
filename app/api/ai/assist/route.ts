import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client safely
const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, outline, request } = body;

    if (!content && !request) {
      return NextResponse.json({ error: "Missing content or request in request body" }, { status: 400 });
    }

    const fallbackResponse = `### Nirvana Editor Assistant (Offline Mode)
- **Style Review**: Aim for a wabi-sabi structure — simple, flawed, yet complete.
- **Outline Tip**: Focus on establishing a clear Stoic limit early, followed by systems diagrams.
- **Content Check**: Your text has a word count of ${(content || "").split(/\s+/).length} words. Ensure paragraph lengths average 40-70 words to maintain reading focus.`;

    if (!anthropic) {
      console.log("[assist] Anthropic key missing, returning offline markdown template.");
      return NextResponse.json({ suggestion: fallbackResponse });
    }

    try {
      let prompt = "";
      if (request) {
        prompt = `Review this writing content:\n"""\n${content || "(No content provided)"}\n"""\n\nAnd fulfill the editor request: "${request}".`;
      } else {
        prompt = `Analyze this writing draft:\n"""\n${content}\n"""\n\nOutline context:\n"""\n${outline || "(No outline provided)"}\n"""\n\nProvide 3 highly specific bullet points to improve the clarity, structure, and Stoic tone of this draft. Keep it extremely brief and actionable.`;
      }

      const response = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 450,
        temperature: 0.3,
        system: "You are Nirvana, Sumit's calm, minimalist AI writing mentor. Help refine his articles and perspectives. Provide clear, highly constructive suggestions. Avoid preachy language. Structure output using clean Markdown headers and bullet points.",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";
      return NextResponse.json({ suggestion: text || fallbackResponse });
    } catch (apiErr) {
      console.warn("[assist] Claude API request failed:", apiErr);
      return NextResponse.json({ suggestion: fallbackResponse });
    }
  } catch (err: any) {
    console.error("Assist API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
