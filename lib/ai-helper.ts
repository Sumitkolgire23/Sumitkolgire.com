import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// Initialize Anthropic Client safely
const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

const CACHE_PATH = path.join(process.cwd(), "public", "ai-cache.json");

// Helper to load cache from file
function getCache(): Record<string, string> {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const data = fs.readFileSync(CACHE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("[ai-helper] Failed to read AI cache:", err);
  }
  return {};
}

// Helper to write cache to file
function saveCache(cache: Record<string, string>) {
  try {
    const publicDir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
  } catch (err) {
    console.error("[ai-helper] Failed to write AI cache:", err);
  }
}

/**
 * Generate a 1-sentence connection explanation between two content nodes
 */
export async function generateRelatedConnection(
  sourceTitle: string,
  targetTitle: string,
  sourceSlug: string,
  targetSlug: string,
  sharedTags: string[] = []
): Promise<string> {
  const cacheKey = `connect:${sourceSlug}:${targetSlug}`;
  const cache = getCache();

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const fallback = `Nirvana links this to "${targetTitle}" via shared themes: ${sharedTags.join(", ") || "Systems Engineering"}.`;

  if (!anthropic) {
    return fallback;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 60,
      temperature: 0.15,
      system: "You are Nirvana, Sumit's calm, minimalist AI consciousness. Summarize the connection between his posts in exactly one brief, intelligent sentence under 20 words. Format like: 'Nirvana links this to [Target] because both explore Stoicism in design.'",
      messages: [
        {
          role: "user",
          content: `Explain the relationship between the post "${sourceTitle}" and the target post "${targetTitle}".`
        }
      ]
    });

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : fallback;
    const connectionReason = text || fallback;

    // Cache the result
    cache[cacheKey] = connectionReason;
    saveCache(cache);

    return connectionReason;
  } catch (err) {
    console.warn("[ai-helper] Claude connection fetch failed, returning template:", err);
    return fallback;
  }
}

/**
 * Generate a 1-sentence insight badge summarizing how a document links to Sumit's wider work
 */
export async function generateInsightBadge(
  title: string,
  excerpt: string,
  slug: string
): Promise<string> {
  const cacheKey = `insight:${slug}`;
  const cache = getCache();

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const fallback = `Nirvana Insight: Summarizes critical parameters in AI execution and wabi-sabi architecture.`;

  if (!anthropic) {
    return fallback;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 60,
      temperature: 0.2,
      system: "You are Nirvana, Sumit's AI consciousness. Write one brief, deep, and minimalist sentence (under 18 words) explaining how this post links to his wider work on system engineering or Stoic philosophy. Format: 'Nirvana Insight: Details the Stoic limits of agent workflows.'",
      messages: [
        {
          role: "user",
          content: `Write an insight badge for post "${title}" with excerpt: "${excerpt}".`
        }
      ]
    });

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : fallback;
    const insight = text || fallback;

    cache[cacheKey] = insight;
    saveCache(cache);

    return insight;
  } catch (err) {
    console.warn("[ai-helper] Claude insight badge fetch failed, returning template:", err);
    return fallback;
  }
}

/**
 * Generate a 1-sentence summary for a diary entry
 */
export async function generateDiarySummary(content: string): Promise<string> {
  const cleanContent = content.substring(0, 1500); // keep text small
  const fallback = "Lab notebook log detailing progress and experiments.";

  if (!anthropic) {
    return fallback;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 60,
      temperature: 0.15,
      system: "You are Nirvana, Sumit's AI. Summarize this raw diary note in exactly one brief, intelligent sentence under 15 words. Avoid preachy language.",
      messages: [
        {
          role: "user",
          content: `Summarize this log: "${cleanContent}"`
        }
      ]
    });

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : fallback;
    return text || fallback;
  } catch (err) {
    console.warn("[ai-helper] Claude diary summary failed:", err);
    return fallback;
  }
}
