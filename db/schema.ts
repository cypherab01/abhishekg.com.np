import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  real,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Singleton row (id = 1) holding all personal / profile information,
 * plus the uploaded avatar and resume file URLs (UploadThing).
 */
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull(),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull(),
  website: text("website").notNull().default(""),
  github: text("github").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  headline: text("headline").notNull().default(""),
  summary: text("summary").notNull().default(""),
  about: text("about").notNull().default(""),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Work experience and teaching, distinguished by `kind`.
 */
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull().default("work"), // "work" | "teaching"
  title: text("title").notNull(),
  company: text("company").notNull().default(""),
  location: text("location").notNull().default(""),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  current: boolean("current").notNull().default(false),
  responsibilities: jsonb("responsibilities")
    .$type<string[]>()
    .notNull()
    .default([]),
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull().default(""),
  status: text("status").notNull().default(""),
  website: text("website"),
  playStore: text("play_store"),
  github: text("github"),
  coverImage: text("cover_image"),
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  description: jsonb("description").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  university: text("university").notNull().default(""),
  faculty: text("faculty").notNull().default(""),
  location: text("location").notNull().default(""),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  cgpa: real("cgpa"),
  cgpaScale: real("cgpa_scale"),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // Languages, Frontend, Backend, Databases, Tools
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * Contact-form submissions.
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Profile = typeof profile.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Message = typeof messages.$inferSelect;
