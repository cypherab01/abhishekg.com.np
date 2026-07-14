import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

/**
 * The public site reads the profile row directly (no lazy bootstrap like
 * the admin pages have) and shows a "No profile found" message without it.
 * Everything else — experience, projects, education, skills, resume config —
 * is optional: the public sections render nothing when empty, and the admin
 * dashboard has empty-state "add your first entry" flows for all of them.
 */
async function main() {
  console.log("🌱 Seeding database...");

  await db.delete(schema.profile);

  await db.insert(schema.profile).values({
    id: 1,
    name: "Your Name",
    initials: "YN",
    role: "Your Role",
    location: "Your City, Country",
    phone: "",
    email: "you@example.com",
    website: "",
    github: "",
    linkedin: "",
    headline: "Your Role",
    summary:
      "A short intro that shows up in the hero section — replace this from /admin/profile.",
    about:
      "A longer bio for the About page. Replace this from /admin/profile with your own background, stack, and interests.",
  });

  console.log("✅ Seed complete — now fill in the rest from /admin");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
