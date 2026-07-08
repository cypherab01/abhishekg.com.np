import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "./index";
import {
  profile as profileTable,
  experiences as experiencesTable,
  experienceKinds as experienceKindsTable,
  projectCategories as projectCategoriesTable,
  projects as projectsTable,
  education as educationTable,
  skillCategories as skillCategoriesTable,
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

export async function ensureProfile() {
  const profile = await getProfile();
  if (profile) return profile;

  await db
    .insert(profileTable)
    .values({
      id: 1,
      name: "",
      initials: "",
      role: "",
      location: "",
      phone: "",
      email: "",
      website: "",
      github: "",
      linkedin: "",
      headline: "",
      summary: "",
      about: "",
      avatarUrl: null,
      resumeUrl: null,
      updatedAt: new Date(),
    })
    .onConflictDoNothing();

  return getProfile();
}

export async function getExperienceKindList() {
  return db
    .select()
    .from(experienceKindsTable)
    .orderBy(
      asc(experienceKindsTable.sortOrder),
      asc(experienceKindsTable.id),
    );
}

export async function getExperienceKindNames() {
  const kinds = await getExperienceKindList();
  return kinds.map((kind) => kind.name);
}

export async function getExperiences(kind: string) {
  const kindRow = await db
    .select()
    .from(experienceKindsTable)
    .where(eq(experienceKindsTable.name, kind))
    .limit(1);

  if (!kindRow[0]) return [];

  return db
    .select()
    .from(experiencesTable)
    .where(eq(experiencesTable.kindId, kindRow[0].id))
    .orderBy(asc(experiencesTable.sortOrder), asc(experiencesTable.id));
}

export async function getAllExperiences() {
  return db
    .select()
    .from(experiencesTable)
    .orderBy(asc(experiencesTable.sortOrder), asc(experiencesTable.id));
}

function experienceKindLabel(kind: string) {
  return kind
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getExperienceGroups() {
  const [kinds, rows] = await Promise.all([
    getExperienceKindList(),
    getAllExperiences(),
  ]);

  const grouped = new Map<number, typeof rows>();
  for (const row of rows) {
    if (!grouped.has(row.kindId)) grouped.set(row.kindId, []);
    grouped.get(row.kindId)!.push(row);
  }

  return kinds.map((kind) => ({
    id: kind.id,
    kind: kind.name,
    label: experienceKindLabel(kind.name),
    sortOrder: kind.sortOrder,
    items: grouped.get(kind.id) ?? [],
  }));
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

export async function getProjectCategoryList() {
  return db
    .select()
    .from(projectCategoriesTable)
    .orderBy(asc(projectCategoriesTable.sortOrder), asc(projectCategoriesTable.id));
}

export async function getProjectCategories() {
  return getProjectCategoryList();
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

export async function getProjectCategoryByName(name: string) {
  const rows = await db
    .select()
    .from(projectCategoriesTable)
    .where(eq(projectCategoriesTable.name, name))
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

export async function getSkillCategoryList() {
  return db
    .select()
    .from(skillCategoriesTable)
    .orderBy(asc(skillCategoriesTable.sortOrder), asc(skillCategoriesTable.id));
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
    .orderBy(
      asc(skillsTable.categoryId),
      asc(skillsTable.sortOrder),
      asc(skillsTable.id),
    );
}

export async function getSkillGroups() {
  const [categories, skills] = await Promise.all([
    getSkillCategoryList(),
    getSkills(),
  ]);

  const grouped = new Map<number, typeof skills>();
  for (const row of skills) {
    if (!grouped.has(row.categoryId)) grouped.set(row.categoryId, []);
    grouped.get(row.categoryId)!.push(row);
  }

  return categories
    .map((category) => ({
      id: category.id,
      label: category.name,
      sortOrder: category.sortOrder,
      items: grouped.get(category.id) ?? [],
    }))
    .filter((group) => group.items.length > 0);
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
