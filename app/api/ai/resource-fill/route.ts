import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client safely
const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing url parameter in request body" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL structure" }, { status: 400 });
    }

    const domainName = parsedUrl.hostname.replace("www.", "");
    let title = "";
    let description = "";

    // 1. Attempt to fetch and scrape the URL with a user-agent header
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
      });

      if (response.ok) {
        const html = await response.text();

        // Title regex match
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch) {
          title = decodeHtmlEntities(titleMatch[1].trim());
        }

        // Description regex matches (standard description, og:description, twitter:description)
        const descMatch = 
          html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) ||
          html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i) ||
          html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["']/i) ||
          html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+property=["']og:description["']/i);
          
        if (descMatch) {
          description = decodeHtmlEntities(descMatch[1].trim());
        }
      }
    } catch (scrapeErr) {
      console.warn(`[resource-fill] Scraper failed for url: ${url}`, scrapeErr);
    }

    // Default title fallback if fetch failed or page had no title
    if (!title) {
      // Create clean title from URL slug
      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      const lastSegment = pathSegments.pop() || domainName;
      title = lastSegment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    // 2. Classify properties with fallback structures
    const generateFallbackResource = () => {
      const lowerUrl = url.toLowerCase();
      let resDomain = "Web";
      let resType = "article";

      if (lowerUrl.includes("arxiv.org") || lowerUrl.includes("researchgate") || lowerUrl.includes("/paper")) {
        resDomain = "Research";
        resType = "paper";
      } else if (lowerUrl.includes("github.com") || lowerUrl.includes("npm") || lowerUrl.includes("tool") || lowerUrl.includes("developer")) {
        resDomain = "Tools";
        resType = "tool";
      } else if (lowerUrl.includes("book") || lowerUrl.includes("amazon.com") || lowerUrl.includes("oreilly")) {
        resDomain = "Philosophy";
        resType = "book";
      } else if (lowerUrl.includes("stoic") || lowerUrl.includes("philosophy")) {
        resDomain = "Philosophy";
        resType = "article";
      } else if (lowerUrl.includes("ml") || lowerUrl.includes("ai") || lowerUrl.includes("deeplearning")) {
        resDomain = "AI";
        resType = "article";
      }

      return {
        title,
        url,
        domain: resDomain,
        type: resType,
        note: `Curated resource detailing concepts on ${domainName}.`
      };
    };

    if (!anthropic) {
      console.log("[resource-fill] Anthropic key missing, returning categorized regex fallback.");
      return NextResponse.json(generateFallbackResource());
    }

    try {
      const systemPrompt = `You are Nirvana, Sumit's AI. Categorize this crawled web page into the wabi-sabi library structure.
Return a valid JSON object matching the following TypeScript schema:
{
  "note": string; // A Stoic, minimalist explanation of why this resource matters, under 18 words. Format: 'Nirvana recommends this because it defines...' or similar.
  "domain": "AI" | "ML" | "Systems" | "Philosophy" | "Tools" | "Web" | "Research";
  "type": "book" | "paper" | "tool" | "article";
}
Return ONLY valid JSON and absolutely nothing else. No markdown wraps, no extra characters.`;

      const response = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 150,
        temperature: 0.15,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Categorize this resource:\nURL: ${url}\nTitle: ${title}\nDescription: ${description || "No description available"}`
          }
        ]
      });

      const textOutput = response.content[0].type === "text" ? response.content[0].text.trim() : "";
      const cleanJson = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const parsed = JSON.parse(cleanJson);
        if (parsed.note && parsed.domain && parsed.type) {
          return NextResponse.json({
            title,
            url,
            domain: parsed.domain,
            type: parsed.type,
            note: parsed.note
          });
        }
      } catch (jsonErr) {
        console.warn("[resource-fill] JSON parsing failed for response:", textOutput, jsonErr);
      }
    } catch (apiErr) {
      console.warn("[resource-fill] Claude categorization failed:", apiErr);
    }

    // Return fallback if Claude API failed or output was malformed
    return NextResponse.json(generateFallbackResource());
  } catch (err: any) {
    console.error("Resource fill API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
