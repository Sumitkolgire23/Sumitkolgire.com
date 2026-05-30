CREATE TABLE "ai_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_key" text NOT NULL,
	"response" text NOT NULL,
	"model" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "graph_edges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_slug" text NOT NULL,
	"target_slug" text NOT NULL,
	"similarity" real NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "graph_edges_unique_pair" UNIQUE("source_slug","target_slug")
);
--> statement-breakpoint
CREATE INDEX "ai_cache_key_idx" ON "ai_cache" USING btree ("cache_key");--> statement-breakpoint
CREATE INDEX "ai_cache_expires_idx" ON "ai_cache" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "graph_edges_source_idx" ON "graph_edges" USING btree ("source_slug");--> statement-breakpoint
CREATE INDEX "graph_edges_target_idx" ON "graph_edges" USING btree ("target_slug");