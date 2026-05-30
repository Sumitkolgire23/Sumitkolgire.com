CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "content_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"content_type" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"chunk_content" text NOT NULL,
	"embedding" vector(384) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "embeddings_content_id_idx" ON "content_embeddings" USING btree ("content_id");
--> statement-breakpoint
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content_id text,
  content_type text,
  chunk_index int,
  chunk_content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    content_embeddings.id,
    content_embeddings.content_id,
    content_embeddings.content_type,
    content_embeddings.chunk_index,
    content_embeddings.chunk_content,
    1 - (content_embeddings.embedding <=> query_embedding) AS similarity
  FROM content_embeddings
  WHERE 1 - (content_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY content_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;