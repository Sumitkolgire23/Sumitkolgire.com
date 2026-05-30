import fs from "fs";
import path from "path";
import { pipeline } from "@huggingface/transformers";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Initialize Supabase Client. Try to use service role key for writing, fallback to anon key
const supabaseKey = serviceRoleKey || supabaseAnonKey;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Chunker configuration
const MAX_CHUNK_SIZE = 700;
const OVERLAP_WORDS = 10;

// Helper to chunk text with sliding-window overlap
function chunkText(text: string, maxChunkSize = MAX_CHUNK_SIZE): string[] {
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let currentChunk = "";
  
  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChunkSize) {
      // Split large paragraph into sentences
      const sentences = paragraph.split(/(?<=[.?!])\s+/);
      for (const sentence of sentences) {
        if ((currentChunk + " " + sentence).length > maxChunkSize) {
          if (currentChunk) chunks.push(currentChunk.trim());
          const lastWords = currentChunk.split(/\s+/).slice(-OVERLAP_WORDS).join(" ");
          currentChunk = lastWords + " " + sentence;
        } else {
          currentChunk += (currentChunk ? " " : "") + sentence;
        }
      }
    } else {
      if ((currentChunk + " \n" + paragraph).length > maxChunkSize) {
        if (currentChunk) chunks.push(currentChunk.trim());
        const lastWords = currentChunk.split(/\s+/).slice(-OVERLAP_WORDS).join(" ");
        currentChunk = lastWords + " \n" + paragraph;
      } else {
        currentChunk += (currentChunk ? " \n" : "") + paragraph;
      }
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

// Helper to clean MDX compiled body
function extractTextFromMDXBody(bodyStr: string): string {
  const matches: string[] = [];
  
  // Match double-quoted children: children:"..."
  const doubleQuoteRegex = /children:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  let match;
  while ((match = doubleQuoteRegex.exec(bodyStr)) !== null) {
    try {
      const val = JSON.parse(`"${match[1]}"`);
      matches.push(val);
    } catch {
      matches.push(match[1]);
    }
  }
  
  // Match single-quoted children: children:'...'
  const singleQuoteRegex = /children:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  while ((match = singleQuoteRegex.exec(bodyStr)) !== null) {
    matches.push(match[1].replace(/\\'/g, "'"));
  }
  
  // Match longer single quoted strings representing prose
  const stringRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  while ((match = stringRegex.exec(bodyStr)) !== null) {
    const s = match[1].replace(/\\'/g, "'");
    if (s.length > 10 && !s.includes("components") && !s.includes("Fragment")) {
      matches.push(s);
    }
  }

  const cleanMatches = matches.filter((text) => {
    const t = text.trim();
    if (t.length <= 1) return false;
    if (t === "\\n" || t === "em" || t === "strong" || t === "h2" || t === "h3" || t === "p" || t === "li") return false;
    return true;
  });

  return Array.from(new Set(cleanMatches)).join(" ");
}

interface EmbedNode {
  content_id: string;
  content_type: string;
  chunk_index: number;
  chunk_content: string;
  embedding: number[];
}

async function run() {
  console.log("=== Ask Nirvana Embedding Generator ===");
  
  // 1. Load HuggingFace transformers feature extraction pipeline
  console.log("Loading feature-extraction model 'Xenova/all-MiniLM-L6-v2'...");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  
  const allEmbeddings: EmbedNode[] = [];
  
  // 2. Load Velite JSON data
  const veliteDir = path.join(process.cwd(), ".velite");
  const contentTypes = [
    { file: "articles.json", type: "article" },
    { file: "perspectives.json", type: "perspective" },
    { file: "projects.json", type: "project" },
    { file: "docs.json", type: "doc" }
  ];
  
  for (const { file, type } of contentTypes) {
    const filePath = path.join(veliteDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] Velite file ${file} does not exist.`);
      continue;
    }
    
    console.log(`Processing ${type} items from ${file}...`);
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    for (const item of items) {
      if (item.status === "draft") continue;
      
      const title = item.title;
      const excerpt = item.excerpt || "";
      const bodyText = extractTextFromMDXBody(item.body || "");
      
      const fullText = `${title}\n${excerpt}\n${bodyText}`;
      const chunks = chunkText(fullText);
      
      console.log(`-> '${title}' split into ${chunks.length} chunks.`);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const output = await extractor(chunk, { pooling: "mean", normalize: true });
        const embedding = Array.from(output.data);
        
        allEmbeddings.push({
          content_id: item.slug, // e.g. "articles/hello-this-is-my-lab"
          content_type: type,
          chunk_index: i,
          chunk_content: chunk,
          embedding
        });
      }
    }
  }

  // 3. Fetch and process public diary entries and ideas from Supabase (if client is active)
  if (supabase) {
    console.log("Connecting to Supabase to fetch public ideas and diary entries...");
    try {
      // Fetch public ideas
      const { data: publicIdeas, error: ideasErr } = await supabase
        .from("ideas")
        .select("id, content, planted_at")
        .eq("is_public", true);
        
      if (ideasErr) {
        console.log("Could not fetch public ideas:", ideasErr.message);
      } else if (publicIdeas) {
        console.log(`Fetched ${publicIdeas.length} public ideas.`);
        for (const idea of publicIdeas) {
          const content = idea.content;
          const chunks = chunkText(content);
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const output = await extractor(chunk, { pooling: "mean", normalize: true });
            const embedding = Array.from(output.data);
            allEmbeddings.push({
              content_id: `ideas/${idea.id}`,
              content_type: "idea",
              chunk_index: i,
              chunk_content: chunk,
              embedding
            });
          }
        }
      }

      // Fetch public diary entries
      const { data: publicDiary, error: diaryErr } = await supabase
        .from("diary_entries")
        .select("id, content, written_at")
        .eq("is_public", true);
        
      if (diaryErr) {
        console.log("Could not fetch public diary entries:", diaryErr.message);
      } else if (publicDiary) {
        console.log(`Fetched ${publicDiary.length} public diary entries.`);
        for (const entry of publicDiary) {
          const content = entry.content;
          const chunks = chunkText(content);
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const output = await extractor(chunk, { pooling: "mean", normalize: true });
            const embedding = Array.from(output.data);
            allEmbeddings.push({
              content_id: `diary/${entry.id}`,
              content_type: "diary",
              chunk_index: i,
              chunk_content: chunk,
              embedding
            });
          }
        }
      }
    } catch (err: any) {
      console.log("Supabase fetch failed (skipping db content):", err.message || err);
    }
  }

  console.log(`Generated total of ${allEmbeddings.length} content chunks.`);

  // 4. Save locally as offline/dev mode fallback JSON
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const jsonPath = path.join(publicDir, "embeddings.json");
  fs.writeFileSync(jsonPath, JSON.stringify(allEmbeddings, null, 2), "utf-8");
  console.log(`[SUCCESS] Saved ${allEmbeddings.length} chunks to local fallback: public/embeddings.json`);

  // 5. Try to upload to Supabase content_embeddings table
  if (supabase) {
    console.log("Uploading embeddings to Supabase content_embeddings table...");
    try {
      // First clean existing embeddings in the database to prevent duplicate chunks
      const uniqueContentIds = Array.from(new Set(allEmbeddings.map(e => e.content_id)));
      
      console.log("Clearing outdated database embeddings...");
      for (const cid of uniqueContentIds) {
        await supabase
          .from("content_embeddings")
          .delete()
          .eq("content_id", cid);
      }

      // Batch insert in chunks of 50 records to prevent HTTP payload size limits
      const BATCH_SIZE = 50;
      let uploadedCount = 0;
      for (let i = 0; i < allEmbeddings.length; i += BATCH_SIZE) {
        const batch = allEmbeddings.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
          .from("content_embeddings")
          .insert(batch);
          
        if (error) {
          throw new Error(error.message);
        }
        uploadedCount += batch.length;
        console.log(`Uploaded batch ${i / BATCH_SIZE + 1} (${uploadedCount}/${allEmbeddings.length})...`);
      }
      console.log(`[SUCCESS] Uploaded all ${uploadedCount} embeddings to Supabase!`);
    } catch (err: any) {
      console.log(`[WARNING] Failed to write embeddings to Supabase: ${err.message || err}`);
      console.log("Local offline mode will be utilized during local development.");
    }
  } else {
    console.log("[INFO] No Supabase credentials provided or connection inactive. Saved locally only.");
  }
  console.log("Embedding generation process finished.");
}

run();
