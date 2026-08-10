/**
 * One-time backfill: rows saved before `lines()` split on bullet glyphs hold a
 * whole paragraph in a single array element. Re-split those into real bullets.
 *
 * Run with: bun db/normalize-bullets.ts   (dry run: --dry)
 */
import { eq } from "drizzle-orm";
import { db } from "./index";
import { experiences, projects } from "./schema";

const DRY = process.argv.includes("--dry");

function split(list: string[]): string[] {
  return list
    .flatMap((line) => line.split(/[\n•·▪‣]+/))
    .map((line) => line.replace(/^[-*\s]+/, "").trim())
    .filter(Boolean);
}

async function main() {
  let changed = 0;

  for (const row of await db.select().from(experiences)) {
    const next = split(row.responsibilities);
    if (next.length === row.responsibilities.length) continue;
    changed++;
    console.log(`experience ${row.id} (${row.title}): 1 → ${next.length} lines`);
    if (!DRY) {
      await db
        .update(experiences)
        .set({ responsibilities: next })
        .where(eq(experiences.id, row.id));
    }
  }

  for (const row of await db.select().from(projects)) {
    const next = split(row.description);
    if (next.length === row.description.length) continue;
    changed++;
    console.log(`project ${row.id} (${row.name}): 1 → ${next.length} lines`);
    if (!DRY) {
      await db
        .update(projects)
        .set({ description: next })
        .where(eq(projects.id, row.id));
    }
  }

  console.log(
    changed === 0
      ? "Nothing to normalize."
      : `${DRY ? "Would update" : "Updated"} ${changed} row(s).`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
