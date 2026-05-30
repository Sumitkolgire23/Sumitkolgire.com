import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  vector,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── USERS ─────────────────────────────────────────────────────────────────────
// Single admin row — only Sumit
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("OWNER"), // OWNER | EDITOR
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});


// ── DIARY ENTRIES ──────────────────────────────────────────────────────────────
// Private lab diary — written daily, some optionally public
export const diaryEntries = pgTable(
  "diary_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    mood: text("mood"), // breakthrough | chaos | stillness | reflection
    isPublic: boolean("is_public").default(false).notNull(),
    wordCount: integer("word_count").default(0).notNull(),
    writtenAt: timestamp("written_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"), // soft delete
  },
  (t) => ({
    writtenAtIdx: index("diary_written_at_idx").on(t.writtenAt),
    moodIdx: index("diary_mood_idx").on(t.mood),
    isPublicIdx: index("diary_is_public_idx").on(t.isPublic),
  })
);

// ── IDEAS ──────────────────────────────────────────────────────────────────────
// Raw idea wall — seed → sprout → ripe → published
export const ideas = pgTable(
  "ideas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    ripeness: text("ripeness").default("seed").notNull(), // seed | sprout | ripe | published
    tags: text("tags").array().default([]),
    isPublic: boolean("is_public").default(false).notNull(),
    promotedToSlug: text("promoted_to_slug"), // article slug if promoted
    plantedAt: timestamp("planted_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    ripenessIdx: index("ideas_ripeness_idx").on(t.ripeness),
    plantedAtIdx: index("ideas_planted_at_idx").on(t.plantedAt),
  })
);

// ── RESOURCES ─────────────────────────────────────────────────────────────────
// Curated library — books, papers, tools, links
export const resources = pgTable(
  "resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    domain: text("domain").notNull(), // AI | ML | Systems | Philosophy | Tools | Web | Research
    type: text("type"), // Added missing type column
    note: text("note").notNull(), // one-line "why this matters"
    addedAt: timestamp("added_at").defaultNow().notNull(),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (t) => ({
    domainIdx: index("resources_domain_idx").on(t.domain),
    isActiveIdx: index("resources_is_active_idx").on(t.isActive),
  })
);

// ── SUBSCRIBERS ───────────────────────────────────────────────────────────────
// Newsletter signups
export const subscribers = pgTable(
  "subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    status: text("status").default("active").notNull(), // active | unsubscribed
    source: text("source"), // home | article | newsletter | about
    unsubToken: text("unsub_token").notNull(), // unique token for one-click unsubscribe
    subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
    unsubscribedAt: timestamp("unsubscribed_at"),
  },
  (t) => ({
    emailIdx: index("subscribers_email_idx").on(t.email),
    statusIdx: index("subscribers_status_idx").on(t.status),
  })
);

// ── REACTIONS ─────────────────────────────────────────────────────────────────
// Agree / Challenge reactions on Perspectives (POVs)
// IP is hashed — never stored raw
export const reactions = pgTable(
  "reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postSlug: text("post_slug").notNull(),
    type: text("type").notNull(), // agree | challenge
    ipHash: text("ip_hash").notNull(), // SHA-256(IP + SALT) — never raw IP
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: index("reactions_slug_idx").on(t.postSlug),
    slugTypeIdx: index("reactions_slug_type_idx").on(t.postSlug, t.type),
  })
);

// ── PAGE VIEWS ────────────────────────────────────────────────────────────────
// Privacy-safe view counter (no user tracking, just slug → count)
export const pageViews = pgTable(
  "page_views",
  {
    slug: text("slug").primaryKey(),
    count: integer("count").default(0).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// ── AUDIT LOG ─────────────────────────────────────────────────────────────────
// Every admin action logged — immutable, append-only
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    action: text("action").notNull(), // e.g. "DELETE_SUBSCRIBER", "PUBLISH_ARTICLE"
    target: text("target"), // e.g. subscriber email (hashed) or article slug
    metadata: jsonb("metadata"), // additional context
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIdx: index("audit_user_id_idx").on(t.userId),
    createdAtIdx: index("audit_created_at_idx").on(t.createdAt),
  })
);

// ── RELATIONS ────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  diaryEntries: many(diaryEntries),
  auditLogs: many(auditLog),
}));

export const diaryEntriesRelations = relations(diaryEntries, ({ one }) => ({
  user: one(users, { fields: [diaryEntries.userId], references: [users.id] }),
}));

// ── CONTENT EMBEDDINGS ────────────────────────────────────────────────────────
// Vector search chunks and embeddings for articles, projects, diaries, ideas
export const contentEmbeddings = pgTable(
  "content_embeddings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentId: text("content_id").notNull(),       // e.g. "articles/hello-this-is-my-lab"
    contentType: text("content_type").notNull(),   // "article" | "perspective" | "project" | "diary"
    chunkIndex: integer("chunk_index").notNull(),
    chunkContent: text("chunk_content").notNull(),
    embedding: vector("embedding", { dimensions: 384 }).notNull(), // 384 dims for all-MiniLM-L6-v2
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    contentIdIdx: index("embeddings_content_id_idx").on(t.contentId),
  })
);


// ── SCHEDULED POSTS ───────────────────────────────────────────────────────────
// Posts scheduled to be published in the future
export const scheduledPosts = pgTable(
  "scheduled_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sanityDocId: text("sanity_doc_id").notNull(),
    publishAt: timestamp("publish_at").notNull(),
    status: text("status").default("pending").notNull(), // 'pending' | 'published' | 'failed'
    contentType: text("content_type").notNull(), // 'article' | 'perspective'
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    publishAtIdx: index("scheduled_posts_publish_at_idx").on(t.publishAt),
    statusIdx: index("scheduled_posts_status_idx").on(t.status),
  })
);


