import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scheduledPosts, auditLog } from "@/db/schema";
import { lte, eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      console.error("[Publish API] CRON_SECRET environment variable is not configured.");
      return NextResponse.json(
        { error: "Configuration Error: CRON_SECRET is missing" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();

    // 1. Query scheduled posts that are pending and due/overdue for publication
    const postsToPublish = await db
      .select()
      .from(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.status, "pending"),
          lte(scheduledPosts.publishAt, now)
        )
      );

    if (postsToPublish.length === 0) {
      return NextResponse.json(
        { message: "No pending scheduled posts found to publish." },
        { status: 200 }
      );
    }

    const publishedIds: string[] = [];

    // 2. Perform updates and audit logging inside a transaction
    await db.transaction(async (tx) => {
      for (const post of postsToPublish) {
        // Update scheduled post status to 'published'
        await tx
          .update(scheduledPosts)
          .set({ status: "published" })
          .where(eq(scheduledPosts.id, post.id));

        // Insert log entry into auditLog
        await tx.insert(auditLog).values({
          action: "PUBLISHED_POST",
          target: post.sanityDocId,
          metadata: {
            scheduledPostId: post.id,
            contentType: post.contentType,
            publishAt: post.publishAt.toISOString(),
          },
        });

        publishedIds.push(post.id);
      }
    });

    return NextResponse.json(
      {
        message: `Successfully published ${publishedIds.length} posts.`,
        publishedCount: publishedIds.length,
        publishedIds,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Publish API Error]", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts", details: error.message || error },
      { status: 500 }
    );
  }
}
