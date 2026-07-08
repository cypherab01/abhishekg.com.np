"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  profile,
  experiences,
  experienceKinds,
  projectCategories,
  projects,
  education,
  skillCategories,
  skills,
  messages,
} from "@/db/schema";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import { ensureProfile } from "@/db/queries";

async function assertAuth() {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function optStr(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s.length > 0 ? s : null;
}

function lines(v: FormDataEntryValue | null): string[] {
  return str(v)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function csv(v: FormDataEntryValue | null): string[] {
  return str(v)
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

/* -------------------------------- Auth -------------------------------- */

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = str(formData.get("password"));
  if (!verifyPassword(password)) {
    return { error: "Incorrect password" };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------ Profile ------------------------------- */

export async function updateProfile(formData: FormData) {
  await assertAuth();
  await ensureProfile();
  await db
    .update(profile)
    .set({
      name: str(formData.get("name")),
      initials: str(formData.get("initials")),
      role: str(formData.get("role")),
      location: str(formData.get("location")),
      phone: str(formData.get("phone")),
      email: str(formData.get("email")),
      website: str(formData.get("website")),
      github: str(formData.get("github")),
      linkedin: str(formData.get("linkedin")),
      headline: str(formData.get("headline")),
      summary: str(formData.get("summary")),
      about: str(formData.get("about")),
      avatarUrl: optStr(formData.get("avatarUrl")),
      updatedAt: new Date(),
    })
    .where(eq(profile.id, 1));
  revalidateSite();
  redirect("/admin/profile?saved=1");
}

/* ---------------------------- Experience ------------------------------ */

export async function saveExperience(formData: FormData) {
  await assertAuth();
  const id = optStr(formData.get("id"));
  const kindName = str(formData.get("kind")) || "work";
  let kindRow = await db
    .select()
    .from(experienceKinds)
    .where(eq(experienceKinds.name, kindName))
    .limit(1);

  if (!kindRow[0]) {
    const inserted = await db
      .insert(experienceKinds)
      .values({ name: kindName })
      .returning();
    kindRow = inserted;
  }

  const values = {
    kindId: kindRow[0].id,
    title: str(formData.get("title")),
    company: str(formData.get("company")),
    location: str(formData.get("location")),
    startDate: str(formData.get("startDate")),
    endDate: str(formData.get("endDate")),
    current: formData.get("current") === "on",
    responsibilities: lines(formData.get("responsibilities")),
    technologies: csv(formData.get("technologies")),
    sortOrder: Number(str(formData.get("sortOrder"))) || 0,
  };
  if (id) {
    await db
      .update(experiences)
      .set(values)
      .where(eq(experiences.id, Number(id)));
  } else {
    await db.insert(experiences).values(values);
  }
  revalidateSite();
  redirect("/admin/experience");
}

export async function deleteExperience(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  await db.delete(experiences).where(eq(experiences.id, id));
  revalidateSite();
  revalidatePath("/admin/experience");
}

export async function saveExperienceKind(formData: FormData) {
  await assertAuth();
  const id = optStr(formData.get("id"));
  const values = {
    name: str(formData.get("name")),
    sortOrder: Number(str(formData.get("sortOrder"))) || 0,
  };
  if (id) {
    await db
      .update(experienceKinds)
      .set(values)
      .where(eq(experienceKinds.id, Number(id)));
  } else {
    await db.insert(experienceKinds).values(values);
  }
  revalidateSite();
  revalidatePath("/admin/experience");
}

export async function deleteExperienceKind(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  await db.delete(experienceKinds).where(eq(experienceKinds.id, id));
  revalidateSite();
  revalidatePath("/admin/experience");
}

/* ------------------------------ Projects ------------------------------ */

export async function saveProject(formData: FormData) {
  await assertAuth();
  const id = optStr(formData.get("id"));
  const name = str(formData.get("name"));
  const slug = str(formData.get("slug")) || slugify(name);
  const categoryName = str(formData.get("category")) || "Uncategorized";
  let categoryRow = await db
    .select()
    .from(projectCategories)
    .where(eq(projectCategories.name, categoryName))
    .limit(1);

  if (!categoryRow[0]) {
    const inserted = await db
      .insert(projectCategories)
      .values({ name: categoryName })
      .returning();
    categoryRow = inserted;
  }

  const values = {
    name,
    slug,
    categoryId: categoryRow[0].id,
    status: str(formData.get("status")),
    website: optStr(formData.get("website")),
    playStore: optStr(formData.get("playStore")),
    github: optStr(formData.get("github")),
    coverImage: optStr(formData.get("coverImage")),
    technologies: csv(formData.get("technologies")),
    description: lines(formData.get("description")),
    featured: formData.get("featured") === "on",
    sortOrder: Number(str(formData.get("sortOrder"))) || 0,
  };
  if (id) {
    await db.update(projects).set(values).where(eq(projects.id, Number(id)));
  } else {
    await db.insert(projects).values(values);
  }
  revalidateSite();
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  await db.delete(projects).where(eq(projects.id, id));
  revalidateSite();
  revalidatePath("/admin/projects");
}

export async function saveProjectCategory(formData: FormData) {
  await assertAuth();
  const id = optStr(formData.get("id"));
  const values = {
    name: str(formData.get("name")),
    sortOrder: Number(str(formData.get("sortOrder"))) || 0,
  };
  if (id) {
    await db
      .update(projectCategories)
      .set(values)
      .where(eq(projectCategories.id, Number(id)));
  } else {
    await db.insert(projectCategories).values(values);
  }
  revalidateSite();
  revalidatePath("/admin/projects");
}

export async function deleteProjectCategory(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  await db.delete(projectCategories).where(eq(projectCategories.id, id));
  revalidateSite();
  revalidatePath("/admin/projects");
}

/* ----------------------------- Education ------------------------------ */

export async function saveEducation(formData: FormData) {
  await assertAuth();
  const id = optStr(formData.get("id"));
  const cgpa = str(formData.get("cgpa"));
  const cgpaScale = str(formData.get("cgpaScale"));
  const values = {
    degree: str(formData.get("degree")),
    institution: str(formData.get("institution")),
    university: str(formData.get("university")),
    faculty: str(formData.get("faculty")),
    location: str(formData.get("location")),
    startDate: str(formData.get("startDate")),
    endDate: str(formData.get("endDate")),
    cgpa: cgpa ? Number(cgpa) : null,
    cgpaScale: cgpaScale ? Number(cgpaScale) : null,
    description: str(formData.get("description")),
    sortOrder: Number(str(formData.get("sortOrder"))) || 0,
  };
  if (id) {
    await db.update(education).set(values).where(eq(education.id, Number(id)));
  } else {
    await db.insert(education).values(values);
  }
  revalidateSite();
  redirect("/admin/education");
}

export async function deleteEducation(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  await db.delete(education).where(eq(education.id, id));
  revalidateSite();
  revalidatePath("/admin/education");
}

/* ------------------------------- Skills ------------------------------- */

export async function saveSkill(formData: FormData) {
  await assertAuth();
  const id = optStr(formData.get("id"));
  const values = {
    categoryId: Number(str(formData.get("categoryId"))),
    name: str(formData.get("name")),
    sortOrder: Number(str(formData.get("sortOrder"))) || 0,
  };
  if (id) {
    await db.update(skills).set(values).where(eq(skills.id, Number(id)));
  } else {
    await db.insert(skills).values(values);
  }
  revalidateSite();
  redirect("/admin/skills");
}

export async function saveSkillCategory(formData: FormData) {
  await assertAuth();
  const id = optStr(formData.get("id"));
  const values = {
    name: str(formData.get("name")),
    sortOrder: Number(str(formData.get("sortOrder"))) || 0,
  };
  if (id) {
    await db
      .update(skillCategories)
      .set(values)
      .where(eq(skillCategories.id, Number(id)));
  } else {
    await db.insert(skillCategories).values(values);
  }
  revalidateSite();
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function deleteSkillCategory(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  await db.delete(skillCategories).where(eq(skillCategories.id, id));
  revalidateSite();
  revalidatePath("/admin/skills");
}

export async function deleteSkill(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  await db.delete(skills).where(eq(skills.id, id));
  revalidateSite();
  revalidatePath("/admin/skills");
}

/* ------------------------------ Messages ------------------------------ */

export async function toggleMessageRead(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  const read = formData.get("read") === "true";
  await db.update(messages).set({ read }).where(eq(messages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData) {
  await assertAuth();
  const id = Number(str(formData.get("id")));
  await db.delete(messages).where(eq(messages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
