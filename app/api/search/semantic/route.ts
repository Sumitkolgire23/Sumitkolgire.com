import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@huggingface/transformers";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Global model cache
let pipelineCache: any = null;

async function getExtractor() {
  if (!pipelineCache) {
    pipelineCache = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return pipelineCache;
}

// Cosine similarity
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

// Hybrid matcher
async function matchEmbeddings(queryEmbedding: number[], matchThreshold = 0.15, matchCount = 10) {
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

  // Local JSON fallback
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

        results = scored.filter((item: any) => item.similarity >= matchThreshold);
        
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
    }

    const extractor = await getExtractor();
    const output = await extractor(query, { pooling: "mean", normalize: true });
    const queryEmbedding = Array.from(output.data) as number[];

    const matches = await matchEmbeddings(queryEmbedding);

    // Map matches to a cleaner output format for API consumers
    const formattedMatches = matches.map((m: any) => ({
      contentId: m.content_id,
      contentType: m.content_type,
      chunkIndex: m.chunk_index,
      content: m.chunk_content,
      similarity: m.similarity,
    }));

    return NextResponse.json({ query, results: formattedMatches });
  } catch (error: any) {
    console.error("Semantic search API error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
