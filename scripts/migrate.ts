import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "@/db/index";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./db/migrations" });
  console.log("Migrations completed!");
  await client.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
