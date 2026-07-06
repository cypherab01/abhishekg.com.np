import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env" });

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: "./db/migrations" });
  console.log("✅ Migrations applied");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed", err);
  process.exit(1);
});
