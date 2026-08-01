import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

/**
 * A single pool is shared across the process. In dev, Next.js hot-reload
 * re-evaluates this module on every change, so the pool is cached on
 * `globalThis` — otherwise each reload would leak a fresh set of connections
 * and quickly exhaust the database's `max_connections`.
 */
const globalForDb = globalThis as unknown as { pool?: Pool };

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

// Idle clients can be dropped by the server or a proxy; without an `error`
// listener the emitted event would take down the process.
pool.on("error", (err) => {
  console.error("Unexpected database pool error", err);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
