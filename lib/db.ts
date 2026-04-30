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
  max: 10, // connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

if (process.env.NODE_ENV !== "production") {
  global._pgConnection = client;
}

export const db = drizzle(client, { schema });
export type DB = typeof db;
