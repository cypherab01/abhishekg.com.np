import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

/**
 * Neon's serverless endpoint occasionally rejects requests with a retryable
 * 500 ("Failed to acquire permit to connect… Too many database connection
 * attempts are currently ongoing") when many queries fan out at once — common
 * in dev with hot-reload, or on bursty page loads. Those responses carry a
 * `neon:retryable: true` flag, so we transparently retry them with exponential
 * backoff instead of surfacing the error to the page.
 */
const MAX_ATTEMPTS = 4;

async function retryingFetch(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): Promise<Response> {
  let lastResponse: Response | undefined;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const response = await fetch(input, init);
    if (response.status !== 500) return response;

    // Only retry Neon's explicitly-retryable connection errors.
    let retryable = false;
    try {
      const body = await response.clone().json();
      retryable = body?.["neon:retryable"] === true;
    } catch {
      retryable = false;
    }
    if (!retryable) return response;

    lastResponse = response;
    if (attempt < MAX_ATTEMPTS - 1) {
      const delay = 120 * 2 ** attempt + Math.floor(Math.random() * 80);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return lastResponse!;
}

// `fetchFunction` is a global-only Neon setting, applied to every HTTP query.
neonConfig.fetchFunction = retryingFetch;

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

export * from "./schema";
