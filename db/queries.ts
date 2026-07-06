import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "./index";
import {
  profile as profileTable,
  experiences as experiencesTable,
  projects as projectsTable,
  education as educationTable,
  skills as skillsTable,
  messages as messagesTable,
} from "./schema";

export async function getProfile() {
  const rows = await db
    .select()
    .from(profileTable)
    .where(eq(profileTable.id, 1))
    .limit(1);
  return rows[0] ?? null;
}

export async function getExperiences(kind: "work" | "teaching" = "work") {
  return db
    .select()
    .from(experiencesTable)
    .where(eq(experiencesTable.kind, kind))
    .orderBy(asc(experiencesTable.sortOrder), asc(experiencesTable.id));
}

export async function getAllExperiences() {
  return db
    .select()
    .from(experiencesTable)
    .orderBy(asc(experiencesTable.sortOrder), asc(experiencesTable.id));
}

export async function getExperienceById(id: number) {
  const rows = await db
    .select()
    .from(experiencesTable)
    .where(eq(experiencesTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProjects() {
  return db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.id));
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.featured, true))
    .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.id));
}

export async function getProjectBySlug(slug: string) {
  const rows = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProjectById(id: number) {
  const rows = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getEducationById(id: number) {
  const rows = await db
    .select()
    .from(educationTable)
    .where(eq(educationTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getSkillById(id: number) {
  const rows = await db
    .select()
    .from(skillsTable)
    .where(eq(skillsTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getEducation() {
  return db
    .select()
    .from(educationTable)
    .orderBy(asc(educationTable.sortOrder), asc(educationTable.id));
}

export async function getSkills() {
  return db
    .select()
    .from(skillsTable)
    .orderBy(asc(skillsTable.sortOrder), asc(skillsTable.id));
}

const SKILL_CATEGORY_ORDER = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "Tools",
];

export async function getSkillCategories() {
  const rows = await getSkills();
  const grouped = new Map<string, string[]>();
  for (const row of rows) {
    if (!grouped.has(row.category)) grouped.set(row.category, []);
    grouped.get(row.category)!.push(row.name);
  }
  return [...grouped.entries()]
    .sort(
      (a, b) =>
        (SKILL_CATEGORY_ORDER.indexOf(a[0]) + 1 || 99) -
        (SKILL_CATEGORY_ORDER.indexOf(b[0]) + 1 || 99),
    )
    .map(([label, items]) => ({ label, items }));
}

export async function getMessages() {
  return db
    .select()
    .from(messagesTable)
    .orderBy(desc(messagesTable.createdAt));
}

export async function getUnreadMessageCount() {
  const rows = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.read, false));
  return rows.length;
}
