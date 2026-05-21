import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

// Prevent multiple instances in development (Next.js HMR)
declare global {
  // eslint-disable-next-line no-var
  var _pgConnection: postgres.Sql | undefined;
}

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Use existing connection in dev, create new in prod
const client = global._pgConnection ?? postgres(connectionString, {
  // RED TEAM AUDIT NOTE [H-11]: `max: 10` will quickly exhaust Supabase free tier (25 conns max)
  // in a serverless environment like Vercel because each instance gets its own pool.
  // Switch to Supabase Transaction Pooler (port 6543) and set `max: 1` before scale.
  max: 10, // connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

if (process.env.NODE_ENV !== "production") {
  global._pgConnection = client;
}

export const db = drizzle(client, { schema });
export type DB = typeof db;
