import fs from "fs";
import path from "path";
import { getArticleBySlug, getPerspectiveBySlug, getProjectBySlug, getDocBySlug, urlSlug } from "@/lib/velite";
import { generateRelatedConnection } from "./ai-helper";

interface ChunkNode {
  content_id: string;
  content_type: string;
  chunk_content: string;
  chunk_index: number;
  embedding: number[];
}

interface DocEmbedding {
  id: string;
  type: string;
  vector: number[];
}

let docEmbeddingsCache: DocEmbedding[] | null = null;

function loadDocEmbeddings(): DocEmbedding[] {
  if (docEmbeddingsCache) return docEmbeddingsCache;

  try {
    const filePath = path.join(process.cwd(), "public", "embeddings.json");
    if (!fs.existsSync(filePath)) return [];

    const data = fs.readFileSync(filePath, "utf-8");
    const chunks: ChunkNode[] = JSON.parse(data);

    // Group chunks by content_id
    const groups: Record<string, { type: string; embeddings: number[][] }> = {};
    chunks.forEach((c) => {
      // Only relate static articles, perspectives, projects, docs
      if (c.content_type === "idea" || c.content_type === "diary") return;
      
      const normalizedId = urlSlug(c.content_id);
      if (!groups[normalizedId]) {
        groups[normalizedId] = { type: c.content_type, embeddings: [] };
      }
      groups[normalizedId].embeddings.push(c.embedding);
    });

    // Compute average vector for each group
    const docEmbeddings: DocEmbedding[] = [];
    Object.entries(groups).forEach(([id, info]) => {
      const count = info.embeddings.length;
      if (count === 0) return;

      const dim = info.embeddings[0].length;
      const averageVector = new Array(dim).fill(0);

      info.embeddings.forEach((v) => {
        for (let i = 0; i < dim; i++) {
          averageVector[i] += v[i];
        }
      });

      for (let i = 0; i < dim; i++) {
        averageVector[i] /= count;
      }

      docEmbeddings.push({
        id,
        type: info.type,
        vector: averageVector,
      });
    });

    docEmbeddingsCache = docEmbeddings;
    return docEmbeddings;
  } catch (err) {
    console.error("[semantic] Failed to load or calculate document embeddings:", err);
    return [];
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function getSemanticRelatedPosts(
  currentSlug: string,
  limit = 3
): Promise<{ item: any; type: string; similarity: number; connectionReason: string }[]> {
  const docs = loadDocEmbeddings();
  const normalizedCurrentSlug = urlSlug(currentSlug);
  
  // Find current document vector representation
  const currentDoc = docs.find((d) => d.id === normalizedCurrentSlug);

  if (!currentDoc) {
    console.warn(`[semantic] Current document vector not found for slug: ${currentSlug}`);
    return [];
  }

  // Calculate similarity to all other documents
  const scored = docs
    .filter((d) => d.id !== currentDoc.id)
    .map((d) => {
      const similarity = cosineSimilarity(currentDoc.vector, d.vector);
      return {
        id: d.id,
        type: d.type,
        similarity,
      };
    })
    .sort((a, b) => b.similarity - a.similarity);

  const topMatches = scored.slice(0, limit);
  const results: any[] = [];

  for (const match of topMatches) {
    let item: any = null;

    if (match.type === "article") item = getArticleBySlug(match.id);
    else if (match.type === "perspective") item = getPerspectiveBySlug(match.id);
    else if (match.type === "project") item = getProjectBySlug(match.id);
    else if (match.type === "doc") item = getDocBySlug(match.id);

    if (item) {
      // Fetch dynamic or cached connection reason
      const connectionReason = await generateRelatedConnection(
        currentDoc.id,
        item.title,
        currentDoc.id,
        match.id,
        item.tags || []
      );

      results.push({
        item,
        type: match.type,
        similarity: match.similarity,
        connectionReason,
      });
    }
  }

  return results;
}
