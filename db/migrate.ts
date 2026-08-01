import { config } from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

config({ path: ".env" });

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "./db/migrations" });
  await pool.end();
  console.log("✅ Migrations applied");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed", err);
  process.exit(1);
});
