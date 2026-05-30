import { NextRequest } from "next/server";
import { pipeline } from "@huggingface/transformers";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { withAnthropicRetry } from "@/lib/retry";
import fs from "fs";
import path from "path";

// Initialize Anthropic SDK
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Global model cache to prevent reloading on every API call (cold-start optimization)
let pipelineCache: any = null;

async function getExtractor() {
  if (!pipelineCache) {
    pipelineCache = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return pipelineCache;
}

// Cosine similarity helper for offline local search
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Hybrid matcher (Supabase RPC -> local embeddings.json fallback)
async function matchEmbeddings(queryEmbedding: number[], matchThreshold = 0.15, matchCount = 6) {
  let results: any[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("match_embeddings", {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
      });
      if (!error && data && data.length > 0) {
        results = data;
      }
    } catch (e) {
      console.log("Supabase RPC failed, using offline fallback:", e);
    }
  }

  // Local JSON fallback if Supabase returned nothing
  if (results.length === 0) {
    try {
      const jsonPath = path.join(process.cwd(), "public", "embeddings.json");
      if (fs.existsSync(jsonPath)) {
        const fileContent = fs.readFileSync(jsonPath, "utf-8");
        const embeddings = JSON.parse(fileContent);
        
        const scored = embeddings.map((node: any) => {
          const similarity = cosineSimilarity(queryEmbedding, node.embedding);
          return {
            content_id: node.content_id,
            content_type: node.content_type,
            chunk_index: node.chunk_index,
            chunk_content: node.chunk_content,
            similarity,
          };
        });

        // Filter by threshold
        results = scored.filter((item: any) => item.similarity >= matchThreshold);
        
        // If nothing matches threshold, take the absolute top 3 matches
        if (results.length === 0) {
          results = scored;
        }
        
        results.sort((a: any, b: any) => b.similarity - a.similarity);
        results = results.slice(0, matchCount);
      }
    } catch (err) {
      console.error("Local match embeddings failed:", err);
    }
  }
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return new Response("Missing message in request body", { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response("ANTHROPIC_API_KEY is not set on the server", { status: 500 });
    }

    // 1. Embed query using local transformers
    const extractor = await getExtractor();
    const output = await extractor(message, { pooling: "mean", normalize: true });
    const queryEmbedding = Array.from(output.data) as number[];

    // 2. Query matches
    const matches = await matchEmbeddings(queryEmbedding);

    // 3. Format context text & citations
    let contextText = "";
    if (matches.length > 0) {
      contextText = matches
        .map((m: any, idx: number) => {
          const contentId = m.content_id || "";
          return `[Source ${idx + 1}] (Slug: ${contentId}, Type: ${m.content_type || "unknown"}):\n${m.chunk_content || ""}\n`;
        })
        .join("\n---\n");
    } else {
      contextText = "No relevant documents found. Answer from your general knowledge about Sumit Kolgire.";
    }

    // 4. Construct System Prompt
    const systemPrompt = `You are Nirvana, the interactive digital brain and AI assistant of Sumit Kolgire.
Your goal is to answer questions about Sumit, his writings, thoughts, and lab projects using the provided semantic context chunks.

Here is the retrieved context from Sumit's digital brain:
=========================================
${contextText}
=========================================

Instructions:
1. Speak as "Nirvana", a calm, minimalist, highly intelligent digital consciousness.
2. Only speak about facts mentioned in the context if asked about Sumit's work, opinions, or lab entries. If a fact isn't present, politely state that you couldn't find it in Sumit's published context, but answer using reasonable inferences if appropriate.
3. Keep your responses structured, clear, and written in a refined, minimalist style.
4. **CRITICAL CITATIONS RULE**: When referring to information from a source, add inline numeric citations like [1], [2] corresponding to the Source index. At the very end of your response, list the citations with links to the corresponding page:
   - Articles: /articles/[slug]
   - Perspectives: /perspectives/[slug]
   - Projects: /projects/[slug]
   - Docs: /docs/[slug]
   - Diary: /lab-diary (no slug)
   - Ideas: /ideas (no slug)
   Example:
   "[1] [AI Won't Replace Engineers](/perspectives/ai-wont-replace-engineers)" or "[2] [Lab Diary Entry](/lab-diary)"
5. If the user greets you or asks general conversational questions, you can respond warmly without relying strictly on the context.

Let's begin. Speak in the first person as Nirvana.`;

    // 5. Format message history for Anthropic
    const formattedMessages = (history || []).map((h: any) => ({
      role: h.role === "assistant" ? "assistant" as const : "user" as const,
      content: h.content,
    }));
    
    // Add current user prompt
    formattedMessages.push({
      role: "user" as const,
      content: message,
    });

    // 6. Call Anthropic with stream=true (wrapped in retry for resilience)
    const stream = await withAnthropicRetry(() =>
      anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1200,
        system: systemPrompt,
        messages: formattedMessages,
        stream: true,
      })
    );

    // 7. Pipe stream to response
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(customReadable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Ask Nirvana API Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
