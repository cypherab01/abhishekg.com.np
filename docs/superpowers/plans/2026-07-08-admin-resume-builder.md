# Admin Resume Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the admin pick which existing profile/experience/education/skills/projects data appears on a generated one-page A4 resume PDF, preview it, save the selection, and let visitors download it from the front page.

**Architecture:** A new `resume_config` singleton table stores the selection (summary override, section order/visibility, header field toggles, per-item ID allow-lists). `lib/resume/` holds pure data-shaping (`data.ts`, `filter.ts`), a `@react-pdf/renderer` document (`document.tsx`), font registration (`fonts.ts`), and a tiered fit-to-one-page renderer (`build.ts`) that uses `pdf-lib` to check page count and retries at a denser layout if needed. Two route handlers expose this: an admin-only POST preview and a public GET download. The admin builder page is a client component (drag-reorderable sections via `@dnd-kit`) that posts to the preview route live and saves via a server action.

**Tech Stack:** Next.js App Router, Drizzle ORM/Postgres (Neon), `@react-pdf/renderer`, `pdf-lib`, `@fontsource/inter` (font asset source only), `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`, Zod (already a dependency).

## Global Constraints

- No test framework exists in this repo (verified: no vitest/jest, no `*.test.*` files). Verification steps use `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and manual smoke tests against the dev server instead of unit tests.
- Follow existing conventions: singleton tables use `id integer primary key default 1` with a `CHECK (id = 1)` constraint (see `profile`); hand-written idempotent SQL migrations (see `0001`–`0003`) since this repo's drizzle snapshot metadata is stale and `drizzle-kit generate` must NOT be run (it would produce an incorrect diff against `0001`–`0003`, which were hand-authored without updating `db/migrations/meta/*_snapshot.json`).
- Applying the new migration to the real (Neon) database is a hard-to-reverse, shared-state action — do not run `pnpm db:migrate` without the user's explicit go-ahead. Everything up to that point (files, code, `pnpm build`) can proceed without it.
- Dependencies already installed in this session: `@react-pdf/renderer@4.5.1`, `pdf-lib@1.17.1`, `@fontsource/inter@5.2.8`, `@dnd-kit/core@6.3.1`, `@dnd-kit/sortable@10.0.0`, `@dnd-kit/utilities@3.2.2`. Verified locally: `Font.register` accepts a real filesystem path (via `require.resolve`) to a `.woff2` file from `@fontsource/inter/files/inter-latin-<weight>-normal.woff2`, and `pdf-lib`'s `PDFDocument.load(buffer).getPageCount()` correctly reports page count.

---

### Task 1: Schema — `resume_config` table, drop `profile.resumeUrl`

**Files:**
- Modify: `db/schema.ts`
- Create: `db/migrations/0004_resume_config.sql`
- Modify: `db/migrations/meta/_journal.json`

**Interfaces (produced for later tasks):**
- `RESUME_SECTION_KEYS: readonly ["summary","experience","education","skills","projects"]`, type `ResumeSectionKey`
- `RESUME_HEADER_FIELD_KEYS: readonly ["phone","email","website","github","linkedin","location"]`, type `ResumeHeaderField`
- `type ResumeSection = { key: ResumeSectionKey; visible: boolean }`
- `type ResumeHeaderFields = Record<ResumeHeaderField, boolean>`
- `DEFAULT_RESUME_SECTIONS: ResumeSection[]`, `DEFAULT_RESUME_HEADER_FIELDS: ResumeHeaderFields`
- `resumeConfig` pgTable, `type ResumeConfig = typeof resumeConfig.$inferSelect`

- [ ] **Step 1: Edit `db/schema.ts`** — remove the `resumeUrl: text("resume_url"),` line from the `profile` table (and drop "and resume file URLs" from the doc comment above it), then append after the `messages` table definition (before the `export type Profile = ...` block, so all types stay grouped at the bottom — add `ResumeConfig` to that group instead):

```ts
export const RESUME_SECTION_KEYS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
] as const;
export type ResumeSectionKey = (typeof RESUME_SECTION_KEYS)[number];

export type ResumeSection = {
  key: ResumeSectionKey;
  visible: boolean;
};

export const RESUME_HEADER_FIELD_KEYS = [
  "phone",
  "email",
  "website",
  "github",
  "linkedin",
  "location",
] as const;
export type ResumeHeaderField = (typeof RESUME_HEADER_FIELD_KEYS)[number];

export type ResumeHeaderFields = Record<ResumeHeaderField, boolean>;

export const DEFAULT_RESUME_SECTIONS: ResumeSection[] = RESUME_SECTION_KEYS.map(
  (key) => ({ key, visible: true }),
);

export const DEFAULT_RESUME_HEADER_FIELDS: ResumeHeaderFields = {
  phone: true,
  email: true,
  website: true,
  github: true,
  linkedin: true,
  location: true,
};

/**
 * Singleton row (id = 1) holding the admin's resume export selection —
 * which sections/items appear in the generated PDF, and in what order.
 */
export const resumeConfig = pgTable("resume_config", {
  id: integer("id").primaryKey().default(1),
  summary: text("summary").notNull().default(""),
  sections: jsonb("sections")
    .$type<ResumeSection[]>()
    .notNull()
    .default(DEFAULT_RESUME_SECTIONS),
  headerFields: jsonb("header_fields")
    .$type<ResumeHeaderFields>()
    .notNull()
    .default(DEFAULT_RESUME_HEADER_FIELDS),
  experienceIds: jsonb("experience_ids").$type<number[]>().notNull().default([]),
  educationIds: jsonb("education_ids").$type<number[]>().notNull().default([]),
  skillIds: jsonb("skill_ids").$type<number[]>().notNull().default([]),
  projectIds: jsonb("project_ids").$type<number[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

  Add `export type ResumeConfig = typeof resumeConfig.$inferSelect;` next to the other `export type ...$inferSelect` lines at the bottom of the file.

- [ ] **Step 2: Create the migration** `db/migrations/0004_resume_config.sql`:

```sql
ALTER TABLE "profile" DROP COLUMN IF EXISTS "resume_url";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_config" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"sections" jsonb DEFAULT '[{"key":"summary","visible":true},{"key":"experience","visible":true},{"key":"education","visible":true},{"key":"skills","visible":true},{"key":"projects","visible":true}]'::jsonb NOT NULL,
	"header_fields" jsonb DEFAULT '{"phone":true,"email":true,"website":true,"github":true,"linkedin":true,"location":true}'::jsonb NOT NULL,
	"experience_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skill_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"project_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resume_config_singleton_check" CHECK ("id" = 1)
);
```

- [ ] **Step 3: Register the migration in the journal** — edit `db/migrations/meta/_journal.json`, add a trailing entry to the `entries` array (after the `idx: 3` entry):

```json
    {
      "idx": 4,
      "version": "7",
      "when": 1783318196325,
      "tag": "0004_resume_config",
      "breakpoints": true
    }
```

- [ ] **Step 4: Type-check** — run `pnpm exec tsc --noEmit`. Expect errors only in files that still reference `profile.resumeUrl` (fixed in Task 2) — no errors related to the new `resumeConfig` export itself.

- [ ] **Step 5: Commit**

```bash
git add db/schema.ts db/migrations/0004_resume_config.sql db/migrations/meta/_journal.json
git commit -m "feat: add resume_config table, drop unused profile.resumeUrl"
```

---

### Task 2: Query helpers — `getResumeConfig`, `ensureResumeConfig`

**Files:**
- Modify: `db/queries.ts`

**Interfaces:**
- Consumes: `resumeConfig`, `DEFAULT_RESUME_SECTIONS`, `DEFAULT_RESUME_HEADER_FIELDS` from `./schema` (Task 1); existing `getProfile`, `getAllExperiences`, `getEducation`, `getSkills`, `getProjects` in this same file.
- Produces: `getResumeConfig(): Promise<ResumeConfig | null>`, `ensureResumeConfig(): Promise<ResumeConfig | null>` (same "insert defaults if missing" contract as `ensureProfile`, but seeds the ID arrays with every currently-existing row so a brand-new config starts with everything selected).

- [ ] **Step 1: Update the import block** at the top of `db/queries.ts` to add:

```ts
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
  resumeConfig as resumeConfigTable,
  DEFAULT_RESUME_SECTIONS,
  DEFAULT_RESUME_HEADER_FIELDS,
} from "./schema";
```

- [ ] **Step 2: Remove `resumeUrl: null,` from `ensureProfile`'s insert values** (in the existing `ensureProfile` function).

- [ ] **Step 3: Append these two functions at the end of `db/queries.ts`**:

```ts
export async function getResumeConfig() {
  const rows = await db
    .select()
    .from(resumeConfigTable)
    .where(eq(resumeConfigTable.id, 1))
    .limit(1);
  return rows[0] ?? null;
}

export async function ensureResumeConfig() {
  const existing = await getResumeConfig();
  if (existing) return existing;

  const [profileRow, allExperiences, allEducation, allSkills, allProjects] =
    await Promise.all([
      getProfile(),
      getAllExperiences(),
      getEducation(),
      getSkills(),
      getProjects(),
    ]);

  await db
    .insert(resumeConfigTable)
    .values({
      id: 1,
      summary: profileRow?.summary ?? "",
      sections: DEFAULT_RESUME_SECTIONS,
      headerFields: DEFAULT_RESUME_HEADER_FIELDS,
      experienceIds: allExperiences.map((row) => row.id),
      educationIds: allEducation.map((row) => row.id),
      skillIds: allSkills.map((row) => row.id),
      projectIds: allProjects.map((row) => row.id),
      updatedAt: new Date(),
    })
    .onConflictDoNothing();

  return getResumeConfig();
}
```

- [ ] **Step 4: Type-check** — `pnpm exec tsc --noEmit`. Expect no errors from `db/queries.ts`.

- [ ] **Step 5: Commit**

```bash
git add db/queries.ts
git commit -m "feat: add resume config query helpers"
```

---

### Task 3: `lib/resume/types.ts` — shared types, Zod schema, tier styles

**Files:**
- Create: `lib/resume/types.ts`

**Interfaces:**
- Consumes: `Profile`, `Experience`, `ExperienceKind`, `Education`, `SkillCategory`, `Skill`, `Project`, `RESUME_SECTION_KEYS`, `RESUME_HEADER_FIELD_KEYS`, `ResumeSectionKey`, `ResumeHeaderField` from `@/db/schema`.
- Produces: `RESUME_TIERS`, `type ResumeTier`, `TIER_STYLES: Record<ResumeTier, TierStyle>`, `resumeConfigInputSchema` (Zod), `type ResumeConfigInput`, `type ResumeData`, `type ResumeExperienceGroup`, `type ResumeSkillGroup`, `type ResumeView`.

- [ ] **Step 1: Write the file**

```ts
import { z } from "zod";
import type {
  Profile,
  Experience,
  ExperienceKind,
  Education,
  SkillCategory,
  Skill,
  Project,
  ResumeSectionKey,
  ResumeHeaderField,
} from "@/db/schema";
import { RESUME_SECTION_KEYS } from "@/db/schema";

export const RESUME_TIERS = ["comfortable", "compact", "dense"] as const;
export type ResumeTier = (typeof RESUME_TIERS)[number];

export type TierStyle = {
  baseFontSize: number;
  headingFontSize: number;
  nameFontSize: number;
  lineHeight: number;
  sectionGap: number;
  itemGap: number;
  bulletGap: number;
};

export const TIER_STYLES: Record<ResumeTier, TierStyle> = {
  comfortable: {
    baseFontSize: 9.6,
    headingFontSize: 11.5,
    nameFontSize: 20,
    lineHeight: 1.35,
    sectionGap: 11,
    itemGap: 7,
    bulletGap: 2.5,
  },
  compact: {
    baseFontSize: 9.2,
    headingFontSize: 11,
    nameFontSize: 19,
    lineHeight: 1.25,
    sectionGap: 9,
    itemGap: 5.5,
    bulletGap: 2,
  },
  dense: {
    baseFontSize: 8.7,
    headingFontSize: 10.5,
    nameFontSize: 18,
    lineHeight: 1.15,
    sectionGap: 7,
    itemGap: 4,
    bulletGap: 1.5,
  },
};

export const resumeConfigInputSchema = z.object({
  summary: z.string(),
  sections: z
    .array(
      z.object({
        key: z.enum(RESUME_SECTION_KEYS),
        visible: z.boolean(),
      }),
    )
    .refine(
      (sections) =>
        sections.length === RESUME_SECTION_KEYS.length &&
        RESUME_SECTION_KEYS.every(
          (key) => sections.filter((s) => s.key === key).length === 1,
        ),
      { message: "sections must contain each section key exactly once" },
    ),
  headerFields: z.object({
    phone: z.boolean(),
    email: z.boolean(),
    website: z.boolean(),
    github: z.boolean(),
    linkedin: z.boolean(),
    location: z.boolean(),
  }),
  experienceIds: z.array(z.number().int()),
  educationIds: z.array(z.number().int()),
  skillIds: z.array(z.number().int()),
  projectIds: z.array(z.number().int()),
});

export type ResumeConfigInput = z.infer<typeof resumeConfigInputSchema>;

export type ResumeData = {
  profile: Profile;
  experienceKinds: ExperienceKind[];
  experiences: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  projects: Project[];
};

export type ResumeExperienceGroup = {
  kindLabel: string;
  items: Experience[];
};

export type ResumeSkillGroup = {
  categoryLabel: string;
  items: Skill[];
};

export type ResumeView = {
  profile: Profile;
  summary: string;
  headerFields: Record<ResumeHeaderField, boolean>;
  sectionOrder: ResumeSectionKey[];
  experienceGroups: ResumeExperienceGroup[];
  education: Education[];
  skillGroups: ResumeSkillGroup[];
  projects: Project[];
};
```

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`. Expect no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/resume/types.ts
git commit -m "feat: add resume builder shared types and validation schema"
```

---

### Task 4: `lib/resume/fonts.ts` — Inter font registration

**Files:**
- Create: `lib/resume/fonts.ts`

**Interfaces:**
- Produces: `registerResumeFonts(): void` — idempotent; safe to call on every request.

- [ ] **Step 1: Write the file**

```ts
import "server-only";
import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerResumeFonts() {
  if (registered) return;

  Font.register({
    family: "Inter",
    fonts: [
      {
        src: require.resolve(
          "@fontsource/inter/files/inter-latin-400-normal.woff2",
        ),
        fontWeight: 400,
      },
      {
        src: require.resolve(
          "@fontsource/inter/files/inter-latin-500-normal.woff2",
        ),
        fontWeight: 500,
      },
      {
        src: require.resolve(
          "@fontsource/inter/files/inter-latin-600-normal.woff2",
        ),
        fontWeight: 600,
      },
      {
        src: require.resolve(
          "@fontsource/inter/files/inter-latin-700-normal.woff2",
        ),
        fontWeight: 700,
      },
    ],
  });

  registered = true;
}
```

  This mirrors a verified-working pattern (confirmed in a standalone Node script during design): `Font.register` needs a real filesystem path, not a Buffer — `require.resolve` gives fontkit that path, and fontkit's bundled `brotli` dependency handles woff2 decoding.

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`. Expect no errors. (If TypeScript complains that `require` is not defined, add `/// <reference types="node" />` at the top of the file — but this should not be necessary since `@types/node` declares `require` globally.)

- [ ] **Step 3: Commit**

```bash
git add lib/resume/fonts.ts
git commit -m "feat: register Inter font for resume PDF rendering"
```

---

### Task 5: `lib/resume/data.ts` — fetch all underlying data

**Files:**
- Create: `lib/resume/data.ts`

**Interfaces:**
- Consumes: `getProfile`, `getAllExperiences`, `getExperienceKindList`, `getEducation`, `getSkills`, `getSkillCategoryList`, `getProjects` from `@/db/queries`; `type ResumeData` from `./types`.
- Produces: `getResumeData(): Promise<ResumeData>` — throws if `profile` is missing (caller is expected to have called `ensureProfile()`/`ensureResumeConfig()` first).

- [ ] **Step 1: Write the file**

```ts
import "server-only";
import {
  getProfile,
  getAllExperiences,
  getExperienceKindList,
  getEducation,
  getSkills,
  getSkillCategoryList,
  getProjects,
} from "@/db/queries";
import type { ResumeData } from "./types";

export async function getResumeData(): Promise<ResumeData> {
  const [
    profile,
    experienceKinds,
    experiences,
    education,
    skillCategories,
    skills,
    projects,
  ] = await Promise.all([
    getProfile(),
    getExperienceKindList(),
    getAllExperiences(),
    getEducation(),
    getSkillCategoryList(),
    getSkills(),
    getProjects(),
  ]);

  if (!profile) {
    throw new Error("Profile must exist before building a resume");
  }

  return {
    profile,
    experienceKinds,
    experiences,
    education,
    skillCategories,
    skills,
    projects,
  };
}
```

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`. Expect no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/resume/data.ts
git commit -m "feat: add resume data fetcher"
```

---

### Task 6: `lib/resume/filter.ts` — apply config to data

**Files:**
- Create: `lib/resume/filter.ts`

**Interfaces:**
- Consumes: `ResumeConfigInput` and `ResumeData` (Task 3, 5); `experienceKindLabel`-equivalent formatting (reimplemented locally — do not import the private helper from `db/queries.ts`).
- Produces: `buildResumeView(config: ResumeConfigInput, data: ResumeData): ResumeView`.

- [ ] **Step 1: Write the file**

```ts
import type { ResumeConfigInput, ResumeData, ResumeView } from "./types";

function labelize(raw: string) {
  return raw
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildResumeView(
  config: ResumeConfigInput,
  data: ResumeData,
): ResumeView {
  const experienceIdSet = new Set(config.experienceIds);
  const educationIdSet = new Set(config.educationIds);
  const skillIdSet = new Set(config.skillIds);
  const projectIdSet = new Set(config.projectIds);

  const selectedExperiences = data.experiences.filter((e) =>
    experienceIdSet.has(e.id),
  );
  const experienceGroups = data.experienceKinds
    .map((kind) => ({
      kindLabel: labelize(kind.name),
      sortOrder: kind.sortOrder,
      items: selectedExperiences.filter((e) => e.kindId === kind.id),
    }))
    .filter((group) => group.items.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ kindLabel, items }) => ({ kindLabel, items }));

  const education = data.education.filter((e) => educationIdSet.has(e.id));

  const selectedSkills = data.skills.filter((s) => skillIdSet.has(s.id));
  const skillGroups = data.skillCategories
    .map((category) => ({
      categoryLabel: category.name,
      sortOrder: category.sortOrder,
      items: selectedSkills.filter((s) => s.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ categoryLabel, items }) => ({ categoryLabel, items }));

  const projects = data.projects.filter((p) => projectIdSet.has(p.id));

  const sectionOrder = config.sections
    .filter((section) => section.visible)
    .map((section) => section.key);

  return {
    profile: data.profile,
    summary: config.summary,
    headerFields: config.headerFields,
    sectionOrder,
    experienceGroups,
    education,
    skillGroups,
    projects,
  };
}
```

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`. Expect no errors.

- [ ] **Step 3: Lint** — `pnpm lint`. Expect no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/resume/filter.ts
git commit -m "feat: add resume config-to-view filtering"
```

---

### Task 7: `lib/resume/document.tsx` — the PDF document

**Files:**
- Create: `lib/resume/document.tsx`

**Interfaces:**
- Consumes: `ResumeView`, `ResumeTier`, `TIER_STYLES` (Tasks 3, 6); `registerResumeFonts` is called by the caller (`build.ts`, Task 8), not inside this file.
- Produces: `ResumeDocument({ view, tier }: { view: ResumeView; tier: ResumeTier }): JSX.Element` (default export).

- [ ] **Step 1: Write the file**

```tsx
import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import type { ResumeView, ResumeTier } from "./types";
import { TIER_STYLES } from "./types";

const PAGE_MARGIN = 28; // ~0.4in, "minimal margin" per design brief

function formatDateRange(start: string, end: string, current: boolean) {
  const endLabel = current ? "Present" : end;
  if (!start && !endLabel) return "";
  if (!start) return endLabel;
  if (!endLabel) return start;
  return `${start} – ${endLabel}`;
}

function contactLine(view: ResumeView) {
  const { profile, headerFields } = view;
  const parts: { label: string; href?: string }[] = [];
  if (headerFields.email && profile.email) {
    parts.push({ label: profile.email, href: `mailto:${profile.email}` });
  }
  if (headerFields.phone && profile.phone) {
    parts.push({ label: profile.phone });
  }
  if (headerFields.location && profile.location) {
    parts.push({ label: profile.location });
  }
  if (headerFields.website && profile.website) {
    parts.push({ label: profile.website, href: profile.website });
  }
  if (headerFields.github && profile.github) {
    parts.push({ label: profile.github, href: profile.github });
  }
  if (headerFields.linkedin && profile.linkedin) {
    parts.push({ label: profile.linkedin, href: profile.linkedin });
  }
  return parts;
}

export default function ResumeDocument({
  view,
  tier,
}: {
  view: ResumeView;
  tier: ResumeTier;
}) {
  const t = TIER_STYLES[tier];

  const styles = StyleSheet.create({
    page: {
      paddingTop: PAGE_MARGIN,
      paddingBottom: PAGE_MARGIN,
      paddingHorizontal: PAGE_MARGIN,
      fontFamily: "Inter",
      fontSize: t.baseFontSize,
      lineHeight: t.lineHeight,
      color: "#1a1a1a",
    },
    name: {
      fontSize: t.nameFontSize,
      fontWeight: 700,
      marginBottom: 2,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      fontSize: t.baseFontSize - 0.5,
      color: "#333333",
      marginBottom: t.sectionGap,
    },
    contactItem: {
      marginRight: 8,
    },
    link: {
      color: "#1a1a1a",
      textDecoration: "none",
    },
    section: {
      marginBottom: t.sectionGap,
    },
    sectionTitle: {
      fontSize: t.headingFontSize,
      fontWeight: 700,
      textTransform: "uppercase",
      borderBottomWidth: 1,
      borderBottomColor: "#1a1a1a",
      paddingBottom: 2,
      marginBottom: t.itemGap,
    },
    item: {
      marginBottom: t.itemGap,
    },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    itemTitle: {
      fontWeight: 600,
    },
    itemMeta: {
      fontStyle: "italic",
      color: "#333333",
    },
    bullet: {
      flexDirection: "row",
      marginBottom: t.bulletGap,
      paddingLeft: 10,
    },
    bulletDot: {
      width: 10,
    },
    bulletText: {
      flex: 1,
    },
    techLine: {
      fontStyle: "italic",
      color: "#333333",
      marginTop: 2,
    },
  });

  const contact = contactLine(view);

  const renderSummary = () =>
    view.summary.trim() ? (
      <View style={styles.section} key="summary">
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text>{view.summary}</Text>
      </View>
    ) : null;

  const renderExperience = () =>
    view.experienceGroups.length > 0 ? (
      <View style={styles.section} key="experience">
        <Text style={styles.sectionTitle}>Experience</Text>
        {view.experienceGroups.map((group) => (
          <View key={group.kindLabel} style={{ marginBottom: t.itemGap }}>
            {view.experienceGroups.length > 1 && (
              <Text style={{ fontWeight: 600, marginBottom: t.bulletGap }}>
                {group.kindLabel}
              </Text>
            )}
            {group.items.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>
                    {exp.title}
                    {exp.company ? ` — ${exp.company}` : ""}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </Text>
                </View>
                {exp.location && (
                  <Text style={styles.itemMeta}>{exp.location}</Text>
                )}
                {exp.responsibilities.map((line, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
                {exp.technologies.length > 0 && (
                  <Text style={styles.techLine}>
                    {exp.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    ) : null;

  const renderEducation = () =>
    view.education.length > 0 ? (
      <View style={styles.section} key="education">
        <Text style={styles.sectionTitle}>Education</Text>
        {view.education.map((edu) => (
          <View key={edu.id} style={styles.item}>
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemTitle}>
                {edu.degree} — {edu.institution}
              </Text>
              <Text style={styles.itemMeta}>
                {formatDateRange(edu.startDate, edu.endDate, false)}
              </Text>
            </View>
            {(edu.university || edu.faculty || edu.location) && (
              <Text style={styles.itemMeta}>
                {[edu.faculty, edu.university, edu.location]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            )}
            {edu.cgpa != null && (
              <Text>
                CGPA: {edu.cgpa}
                {edu.cgpaScale != null ? ` / ${edu.cgpaScale}` : ""}
              </Text>
            )}
            {edu.description && <Text>{edu.description}</Text>}
          </View>
        ))}
      </View>
    ) : null;

  const renderSkills = () =>
    view.skillGroups.length > 0 ? (
      <View style={styles.section} key="skills">
        <Text style={styles.sectionTitle}>Skills</Text>
        {view.skillGroups.map((group) => (
          <Text key={group.categoryLabel} style={{ marginBottom: t.bulletGap }}>
            <Text style={{ fontWeight: 600 }}>{group.categoryLabel}: </Text>
            {group.items.map((s) => s.name).join(", ")}
          </Text>
        ))}
      </View>
    ) : null;

  const renderProjects = () =>
    view.projects.length > 0 ? (
      <View style={styles.section} key="projects">
        <Text style={styles.sectionTitle}>Projects</Text>
        {view.projects.map((project) => {
          const link = project.website || project.github || project.playStore;
          return (
            <View key={project.id} style={styles.item}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                {link && (
                  <Link src={link} style={styles.link}>
                    <Text style={styles.itemMeta}>{link}</Text>
                  </Link>
                )}
              </View>
              {project.technologies.length > 0 && (
                <Text style={styles.techLine}>
                  {project.technologies.join(", ")}
                </Text>
              )}
              {project.description.map((line, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    ) : null;

  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{view.profile.name}</Text>
        {view.profile.headline && (
          <Text style={{ marginBottom: 4, color: "#333333" }}>
            {view.profile.headline}
          </Text>
        )}
        <View style={styles.contactRow}>
          {contact.map((item, i) =>
            item.href ? (
              <Link key={i} src={item.href} style={[styles.link, styles.contactItem]}>
                <Text>{item.label}</Text>
              </Link>
            ) : (
              <Text key={i} style={styles.contactItem}>
                {item.label}
              </Text>
            ),
          )}
        </View>
        {view.sectionOrder.map((key) => sectionRenderers[key]())}
      </Page>
    </Document>
  );
}
```

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`. Fix any JSX/type mismatches (react-pdf's `Text`/`View` accept `style` as an object or array of objects — the `Link` usage above passes an array, matching react-pdf's supported `Style | Style[]` prop type).

- [ ] **Step 3: Lint** — `pnpm lint`.

- [ ] **Step 4: Commit**

```bash
git add lib/resume/document.tsx
git commit -m "feat: add resume PDF document layout"
```

---

### Task 8: `lib/resume/build.ts` — tiered fit-to-one-page renderer

**Files:**
- Create: `lib/resume/build.ts`

**Interfaces:**
- Consumes: `registerResumeFonts` (Task 4), `buildResumeView` (Task 6), `ResumeDocument` (Task 7), `RESUME_TIERS`, `ResumeConfigInput`, `ResumeData` (Task 3); `pdf` from `@react-pdf/renderer`; `PDFDocument` from `pdf-lib`.
- Produces: `buildResumePdfBuffer(config: ResumeConfigInput, data: ResumeData): Promise<Buffer>`.

- [ ] **Step 1: Write the file**

```ts
import "server-only";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { registerResumeFonts } from "./fonts";
import { buildResumeView } from "./filter";
import ResumeDocument from "./document";
import { RESUME_TIERS } from "./types";
import type { ResumeConfigInput, ResumeData } from "./types";

async function countPages(buffer: Buffer): Promise<number> {
  const doc = await PDFDocument.load(buffer);
  return doc.getPageCount();
}

export async function buildResumePdfBuffer(
  config: ResumeConfigInput,
  data: ResumeData,
): Promise<Buffer> {
  registerResumeFonts();
  const view = buildResumeView(config, data);

  let lastBuffer: Buffer | null = null;
  for (const tier of RESUME_TIERS) {
    const buffer = await pdf(ResumeDocument({ view, tier })).toBuffer();
    const chunks: Buffer[] = [];
    for await (const chunk of buffer) chunks.push(chunk as Buffer);
    const built = Buffer.concat(chunks);
    lastBuffer = built;

    const pageCount = await countPages(built);
    if (pageCount <= 1) return built;
  }

  return lastBuffer!;
}
```

  Note: `pdf(...)` expects a React element, and `ResumeDocument({ view, tier })` (calling the component as a plain function) returns exactly that — this avoids needing JSX in a `.ts` file. `toBuffer()` returns a Node `Readable` stream in `@react-pdf/renderer` v4; the `for await...of` loop matches the pattern verified during the design spike (Task 4's note) where `pdf(doc).toBuffer()` was consumed the same way successfully.

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`. If `toBuffer()`'s return type isn't recognized as async-iterable in the installed `@react-pdf/renderer` types, cast it: `const buffer = (await pdf(ResumeDocument({ view, tier })).toBuffer()) as unknown as AsyncIterable<Buffer>;` and adjust the loop accordingly — verify against `node_modules/@react-pdf/renderer`'s type declarations if this comes up.

- [ ] **Step 3: Commit**

```bash
git add lib/resume/build.ts
git commit -m "feat: add tiered fit-to-one-page resume PDF builder"
```

---

### Task 9: `next.config.ts` — font file tracing safety net

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add `outputFileTracingIncludes`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
  outputFileTracingIncludes: {
    "/api/resume": ["./node_modules/@fontsource/inter/files/*.woff2"],
    "/api/resume/preview": ["./node_modules/@fontsource/inter/files/*.woff2"],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`. Expect no errors (this option exists on `NextConfig` in Next.js 16).

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: trace Inter font files into resume API route output"
```

---

### Task 10: `GET /api/resume` — public download route

**Files:**
- Create: `app/api/resume/route.ts`

**Interfaces:**
- Consumes: `ensureProfile`, `ensureResumeConfig` (`@/db/queries`), `getResumeData` (Task 5), `buildResumePdfBuffer` (Task 8).

- [ ] **Step 1: Write the file**

```ts
import { ensureProfile, ensureResumeConfig } from "@/db/queries";
import { getResumeData } from "@/lib/resume/data";
import { buildResumePdfBuffer } from "@/lib/resume/build";
import type { ResumeConfigInput } from "@/lib/resume/types";

export const runtime = "nodejs";

export async function GET() {
  await ensureProfile();
  const config = await ensureResumeConfig();
  if (!config) {
    return new Response("Resume is not configured yet", { status: 404 });
  }

  const data = await getResumeData();
  const input: ResumeConfigInput = {
    summary: config.summary,
    sections: config.sections,
    headerFields: config.headerFields,
    experienceIds: config.experienceIds,
    educationIds: config.educationIds,
    skillIds: config.skillIds,
    projectIds: config.projectIds,
  };

  const buffer = await buildResumePdfBuffer(input, data);
  const fileName = `${data.profile.name.replace(/\s+/g, "-")}-Resume.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
```

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add app/api/resume/route.ts
git commit -m "feat: add public resume PDF download route"
```

---

### Task 11: `POST /api/resume/preview` — admin preview route

**Files:**
- Create: `app/api/resume/preview/route.ts`

**Interfaces:**
- Consumes: `isAuthenticated` (`@/lib/auth`), `resumeConfigInputSchema` (Task 3), `getResumeData` (Task 5), `buildResumePdfBuffer` (Task 8).

- [ ] **Step 1: Write the file**

```ts
import { isAuthenticated } from "@/lib/auth";
import { resumeConfigInputSchema } from "@/lib/resume/types";
import { getResumeData } from "@/lib/resume/data";
import { buildResumePdfBuffer } from "@/lib/resume/build";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const parsed = resumeConfigInputSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await getResumeData();
  const buffer = await buildResumePdfBuffer(parsed.data, data);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "no-store",
    },
  });
}
```

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add app/api/resume/preview/route.ts
git commit -m "feat: add admin resume preview route"
```

---

### Task 12: `saveResumeConfig` server action

**Files:**
- Modify: `app/admin/actions.ts`

**Interfaces:**
- Consumes: `resumeConfig` table (`@/db/schema`), `resumeConfigInputSchema` (Task 3), existing `assertAuth`, `str` helpers in this file.
- Produces: `saveResumeConfig(formData: FormData): Promise<void>` (redirects to `/admin/resume?saved=1` on success).

- [ ] **Step 1: Add the import** — extend the existing `import { profile, experiences, ... } from "@/db/schema";` block in `app/admin/actions.ts` to include `resumeConfig`, and add a new import line:

```ts
import { resumeConfigInputSchema } from "@/lib/resume/types";
```

- [ ] **Step 2: Append this action** at the end of `app/admin/actions.ts`:

```ts
/* ------------------------------- Resume -------------------------------- */

export async function saveResumeConfig(formData: FormData) {
  await assertAuth();
  const raw = str(formData.get("config"));
  const parsed = resumeConfigInputSchema.parse(JSON.parse(raw));

  await db
    .insert(resumeConfig)
    .values({
      id: 1,
      summary: parsed.summary,
      sections: parsed.sections,
      headerFields: parsed.headerFields,
      experienceIds: parsed.experienceIds,
      educationIds: parsed.educationIds,
      skillIds: parsed.skillIds,
      projectIds: parsed.projectIds,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: resumeConfig.id,
      set: {
        summary: parsed.summary,
        sections: parsed.sections,
        headerFields: parsed.headerFields,
        experienceIds: parsed.experienceIds,
        educationIds: parsed.educationIds,
        skillIds: parsed.skillIds,
        projectIds: parsed.projectIds,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/admin/resume");
  redirect("/admin/resume?saved=1");
}
```

- [ ] **Step 3: Type-check** — `pnpm exec tsc --noEmit`.

- [ ] **Step 4: Commit**

```bash
git add app/admin/actions.ts
git commit -m "feat: add saveResumeConfig server action"
```

---

### Task 13: Admin nav entry

**Files:**
- Modify: `lib/nav.ts`
- Modify: `app/admin/admin-sidebar.tsx`

- [ ] **Step 1: Add the nav link** in `lib/nav.ts`, insert `{ label: "Resume", href: "/admin/resume", icon: "resume" }` into `adminNavLinks` right after the `"Skills"` entry (before `"Messages"`).

- [ ] **Step 2: Add the icon mapping** in `app/admin/admin-sidebar.tsx` — add `FileText` to the `lucide-react` import list, and add `resume: FileText,` to the `icons` record.

- [ ] **Step 3: Type-check** — `pnpm exec tsc --noEmit`.

- [ ] **Step 4: Commit**

```bash
git add lib/nav.ts app/admin/admin-sidebar.tsx
git commit -m "feat: add Resume link to admin nav"
```

---

### Task 14: Admin Resume Builder page

**Files:**
- Create: `app/admin/resume/page.tsx` (server component — data fetching)
- Create: `app/admin/resume/resume-builder.tsx` (client component — the form)

**Interfaces:**
- Consumes: `ensureProfile`, `ensureResumeConfig`, `getExperienceGroups`, `getEducation`, `getSkillGroups`, `getProjects` (`@/db/queries`); `saveResumeConfig` (Task 12); `ResumeConfigInput`, `RESUME_SECTION_KEYS`(via `@/db/schema`), `ResumeSectionKey` types; `PageHeader`, `Card` (`../_components/ui`); `SubmitButton` (`../_components/submit-button`); `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.

- [ ] **Step 1: Write `app/admin/resume/page.tsx`**

```tsx
import { CheckCircle2 } from "lucide-react";
import {
  ensureProfile,
  ensureResumeConfig,
  getExperienceGroups,
  getEducation,
  getSkillGroups,
  getProjects,
} from "@/db/queries";
import { PageHeader } from "../_components/ui";
import { ResumeBuilder } from "./resume-builder";

export default async function AdminResumePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [profile, config, experienceGroups, education, skillGroups, projects, sp] =
    await Promise.all([
      ensureProfile(),
      ensureResumeConfig(),
      getExperienceGroups(),
      getEducation(),
      getSkillGroups(),
      getProjects(),
      searchParams,
    ]);

  if (!profile || !config) return <p>Unable to load resume settings.</p>;

  return (
    <div>
      <PageHeader
        title="Resume"
        description="Choose what appears on the downloadable resume PDF."
      />
      {sp.saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          Resume settings saved.
        </div>
      )}
      <ResumeBuilder
        config={config}
        experienceGroups={experienceGroups}
        education={education}
        skillGroups={skillGroups}
        projects={projects}
      />
    </div>
  );
}
```

- [ ] **Step 2: Write `app/admin/resume/resume-builder.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, RefreshCw } from "lucide-react";
import type {
  Education,
  Project,
  ResumeConfig,
  ResumeHeaderField,
  ResumeSection,
  ResumeSectionKey,
} from "@/db/schema";
import { saveResumeConfig } from "../actions";
import { Card } from "../_components/ui";
import { SubmitButton } from "../_components/submit-button";

type ExperienceGroup = {
  id: number;
  kind: string;
  label: string;
  items: {
    id: number;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
  }[];
};

type SkillGroup = {
  id: number;
  label: string;
  items: { id: number; name: string }[];
};

const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
};

const HEADER_FIELD_LABELS: Record<ResumeHeaderField, string> = {
  phone: "Phone",
  email: "Email",
  website: "Website",
  github: "GitHub",
  linkedin: "LinkedIn",
  location: "Location",
};

function experienceLabel(item: ExperienceGroup["items"][number]) {
  const range = `${item.startDate}–${item.current ? "Present" : item.endDate}`;
  return item.company
    ? `${item.title} — ${item.company} (${range})`
    : `${item.title} (${range})`;
}

function educationLabel(item: Education) {
  return `${item.degree} — ${item.institution} (${item.startDate}–${item.endDate})`;
}

function SortableSectionRow({
  section,
  onToggle,
}: {
  section: ResumeSection;
  onToggle: (key: ResumeSectionKey) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.key });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground"
        aria-label={`Reorder ${SECTION_LABELS[section.key]}`}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex-1 text-sm font-medium text-foreground">
        {SECTION_LABELS[section.key]}
      </span>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={section.visible}
          onChange={() => onToggle(section.key)}
        />
        Visible
      </label>
    </div>
  );
}

export function ResumeBuilder({
  config,
  experienceGroups,
  education,
  skillGroups,
  projects,
}: {
  config: ResumeConfig;
  experienceGroups: ExperienceGroup[];
  education: Education[];
  skillGroups: SkillGroup[];
  projects: Project[];
}) {
  const [summary, setSummary] = useState(config.summary);
  const [sections, setSections] = useState<ResumeSection[]>(config.sections);
  const [headerFields, setHeaderFields] = useState(config.headerFields);
  const [experienceIds, setExperienceIds] = useState(
    new Set<number>(config.experienceIds),
  );
  const [educationIds, setEducationIds] = useState(
    new Set<number>(config.educationIds),
  );
  const [skillIds, setSkillIds] = useState(new Set<number>(config.skillIds));
  const [projectIds, setProjectIds] = useState(
    new Set<number>(config.projectIds),
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const configPayload = useMemo(
    () => ({
      summary,
      sections,
      headerFields,
      experienceIds: Array.from(experienceIds),
      educationIds: Array.from(educationIds),
      skillIds: Array.from(skillIds),
      projectIds: Array.from(projectIds),
    }),
    [summary, sections, headerFields, experienceIds, educationIds, skillIds, projectIds],
  );

  function toggleSet(
    set: Set<number>,
    id: number,
    setter: (next: Set<number>) => void,
  ) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  }

  function toggleSection(key: ResumeSectionKey) {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)),
    );
  }

  function toggleHeaderField(field: ResumeHeaderField) {
    setHeaderFields((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.key === active.id);
      const newIndex = prev.findIndex((s) => s.key === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  async function handlePreview() {
    setIsPreviewing(true);
    setPreviewError(null);
    try {
      const res = await fetch("/api/resume/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configPayload),
      });
      if (!res.ok) {
        throw new Error(`Preview failed (${res.status})`);
      }
      const blob = await res.blob();
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setIsPreviewing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start">
      <form action={saveResumeConfig} className="space-y-6">
        <input type="hidden" name="config" value={JSON.stringify(configPayload)} />

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Resume summary</p>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          />
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Header fields</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.keys(HEADER_FIELD_LABELS) as ResumeHeaderField[]).map(
              (field) => (
                <label
                  key={field}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={headerFields[field]}
                    onChange={() => toggleHeaderField(field)}
                  />
                  {HEADER_FIELD_LABELS[field]}
                </label>
              ),
            )}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Sections</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.key)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sections.map((section) => (
                  <SortableSectionRow
                    key={section.key}
                    section={section}
                    onToggle={toggleSection}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Experience</p>
          {experienceGroups.map((group) => (
            <div key={group.id} className="space-y-1.5">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={experienceIds.has(item.id)}
                    onChange={() =>
                      toggleSet(experienceIds, item.id, setExperienceIds)
                    }
                  />
                  {experienceLabel(item)}
                </label>
              ))}
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Education</p>
          {education.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={educationIds.has(item.id)}
                onChange={() => toggleSet(educationIds, item.id, setEducationIds)}
              />
              {educationLabel(item)}
            </label>
          ))}
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Skills</p>
          {skillGroups.map((group) => (
            <div key={group.id} className="space-y-1.5">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {group.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={skillIds.has(item.id)}
                      onChange={() => toggleSet(skillIds, item.id, setSkillIds)}
                    />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Projects</p>
          {projects.map((project) => (
            <label
              key={project.id}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={projectIds.has(project.id)}
                onChange={() => toggleSet(projectIds, project.id, setProjectIds)}
              />
              {project.name}
            </label>
          ))}
        </Card>

        <SubmitButton label="Save settings" />
      </form>

      <div className="lg:sticky lg:top-6 space-y-3">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPreviewing}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
        >
          {isPreviewing ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <Eye className="size-4" />
          )}
          {isPreviewing ? "Rendering..." : "Preview"}
        </button>
        {previewError && (
          <p className="text-sm text-destructive">{previewError}</p>
        )}
        <Card className="h-[80vh] overflow-hidden">
          {previewUrl ? (
            <iframe src={previewUrl} className="h-full w-full" title="Resume preview" />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
              Click Preview to render the resume with your current selections.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
```

  Note: `getExperienceGroups()`/`getSkillGroups()` (from `db/queries.ts`) return objects shaped like `{ id, kind, label, sortOrder, items }` / `{ id, label, sortOrder, items }` where `items` are full `Experience`/`Skill` rows — the `ExperienceGroup`/`SkillGroup` types above narrow `items` to only the fields the UI reads; this is safe because the actual returned objects are supersets (structurally compatible for reading), and no properties are written back onto them.

- [ ] **Step 3: Type-check** — `pnpm exec tsc --noEmit`.

- [ ] **Step 4: Lint** — `pnpm lint`.

- [ ] **Step 5: Commit**

```bash
git add app/admin/resume
git commit -m "feat: add admin resume builder UI"
```

---

### Task 15: Front-end "Download Resume" button

**Files:**
- Modify: `components/sections/hero-cta.tsx`

- [ ] **Step 1: Add the Download link** — import `Download` from `lucide-react`, and add a new `<a>` between the GitHub link and the "Get in Touch" link:

```tsx
import { Mail, Download } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface HeroCtaProps {
  github?: string | null;
  email: string;
}

export function HeroCta({ github, email }: HeroCtaProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <GithubIcon className="size-4 mr-2" />
          GitHub
        </a>
      )}
      <a
        href="/api/resume"
        download
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        <Download className="size-4 mr-2" />
        Download Resume
      </a>
      <a
        href={`mailto:${email}`}
        className={cn(buttonVariants({ variant: "default" }))}
      >
        <Mail className="size-4 mr-2" />
        Get in Touch
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Type-check** — `pnpm exec tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/hero-cta.tsx
git commit -m "feat: add Download Resume button to hero"
```

---

### Task 16: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Full build** — `pnpm build`. Expect a successful production build with no type or lint errors. This is the strongest signal available in a repo with no test suite — it exercises every new file's types and the Next.js route/page graph.

- [ ] **Step 2: Ask the user for permission, then apply the migration** — this touches the real Neon database and is not reversible without a manual rollback, so do not run it silently. Once approved: `pnpm db:migrate`. Confirm it reports the `0004_resume_config` migration applied.

- [ ] **Step 3: Start the dev server** — `pnpm dev` (background), then in a browser:
  - Visit `/admin/resume` (log in first if needed). Confirm the builder loads with every experience/education/skill/project pre-checked (first-ever load, since `ensureResumeConfig` seeds "everything selected").
  - Uncheck a couple of items, drag "Projects" above "Skills", click **Preview** — confirm the iframe shows a one-page A4 PDF reflecting the change.
  - Click **Save settings** — confirm redirect to `/admin/resume?saved=1` with the confirmation banner, and that re-visiting the page shows the saved selections persisted (not reset to "everything").
  - Visit the public homepage `/`, click **Download Resume** in the hero — confirm a PDF downloads matching the saved config.

- [ ] **Step 4: Visual check** — open the downloaded PDF and confirm: A4 size, minimal margins, Inter font, content fits on one page (or degrades gracefully to the "dense" tier if a lot of content was selected).

- [ ] **Step 5: Final commit** (only if Steps 1–4 required fixes)

```bash
git add -A
git commit -m "fix: address issues found during resume builder verification"
```
