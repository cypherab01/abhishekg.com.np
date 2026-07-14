# Education Grade Generalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let each education entry store either a GPA-style score (with an optional scale) or a percentage score, and render the correct format in the admin form, the public portfolio timeline, and the generated PDF resume.

**Architecture:** Replace the `cgpa`/`cgpaScale` columns on the `education` table with `gradeValue` (the number), `gradeScale` (GPA-only, nullable), and `isPercentage` (boolean discriminator). One hand-written SQL migration adds this; the server action, admin form, and both render sites are updated to match. No client-side JS toggle is introduced — the "Scale" field stays always-visible with a hint, matching this codebase's existing plain-server-component form style.

**Tech Stack:** Next.js 16 (App Router, Server Actions), Drizzle ORM (`drizzle-orm/neon-http`), PostgreSQL (Neon), `@react-pdf/renderer` for the PDF resume. No test framework is present in this repo (`package.json` has no `vitest`/`jest`/etc.) — verification is via `npx tsc --noEmit`, `npm run build`, and manual browser checks, matching how the rest of the codebase is validated.

## Global Constraints

- Never run `drizzle-kit generate` / `npm run db:generate` — this repo's snapshot metadata is stale (only `0000_init` exists) and generating would try to recreate tables that already exist. Migrations are hand-written SQL files, following the `CREATE TABLE IF NOT EXISTS` / idempotent style already used in `db/migrations/0000_init.sql`.
- Never run `npm run db:migrate` yourself. Write the migration file, but ask the user to run it (or confirm they already have) before treating the DB-dependent parts of this feature as verified.
- Match existing code style exactly: plain server components for forms (no `"use client"`, no `useState`), the shared `inputClass` styling already used by `<select>` elements in `project-form.tsx` / `experience-form.tsx` / `skill-form.tsx`, and the `str()`/`optStr()` FormData helpers already defined at the top of `app/admin/actions.ts`.
- Do not add zod validation to `saveEducation` — it has none today for `cgpa`/`cgpaScale`, and this change doesn't expand that scope.
- Do not introduce a shared grade-formatting helper — `components/sections/education.tsx` and `lib/resume/document.tsx` already independently duplicate their own CGPA formatting (different punctuation), so keep that pattern rather than force a premature abstraction.

---

## Task 1: Schema change + hand-written migration

**Files:**
- Modify: `db/schema.ts:86-99` (the `education` table definition)
- Create: `db/migrations/0001_education_grade_type.sql`
- Modify: `db/migrations/meta/_journal.json`

**Interfaces:**
- Produces: `Education` type (via `typeof education.$inferSelect`) now has `gradeValue: number | null`, `gradeScale: number | null`, `isPercentage: boolean` instead of `cgpa`/`cgpaScale`. All later tasks (Task 2-4) consume this shape.

- [ ] **Step 1: Update the `education` table definition in `db/schema.ts`**

Find this block (currently lines 86-99):

```ts
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
```

Replace it with:

```ts
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  university: text("university").notNull().default(""),
  faculty: text("faculty").notNull().default(""),
  location: text("location").notNull().default(""),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  gradeValue: real("grade_value"),
  gradeScale: real("grade_scale"),
  isPercentage: boolean("is_percentage").notNull().default(false),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});
```

(`boolean` is already imported at the top of `db/schema.ts` — it's used by `experiences.current`, `projects.featured`, `messages.read` — so no import changes are needed.)

- [ ] **Step 2: Write the migration file**

Create `db/migrations/0001_education_grade_type.sql`:

```sql
ALTER TABLE "education" RENAME COLUMN "cgpa" TO "grade_value";
--> statement-breakpoint
ALTER TABLE "education" RENAME COLUMN "cgpa_scale" TO "grade_scale";
--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "is_percentage" boolean NOT NULL DEFAULT false;
```

- [ ] **Step 3: Register the migration in the journal**

Open `db/migrations/meta/_journal.json`. It currently reads:

```json
{
  "version": "7",
  "dialect": "postgresql",
  "entries": [
    {
      "idx": 0,
      "version": "7",
      "when": 0,
      "tag": "0000_init",
      "breakpoints": true
    }
  ]
}
```

Add a new entry to the `entries` array (append after the `0000_init` entry):

```json
{
  "idx": 1,
  "version": "7",
  "when": 1,
  "tag": "0001_education_grade_type",
  "breakpoints": true
}
```

The full file should read:

```json
{
  "version": "7",
  "dialect": "postgresql",
  "entries": [
    {
      "idx": 0,
      "version": "7",
      "when": 0,
      "tag": "0000_init",
      "breakpoints": true
    },
    {
      "idx": 1,
      "version": "7",
      "when": 1,
      "tag": "0001_education_grade_type",
      "breakpoints": true
    }
  ]
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: Errors in every file still referencing `cgpa`/`cgpaScale` (`app/admin/actions.ts`, `app/admin/education/education-form.tsx`, `components/sections/education.tsx`, `lib/resume/document.tsx`) — this is expected at this point; those are fixed in Tasks 2-4. Confirm there are no errors in `db/schema.ts` itself.

- [ ] **Step 5: Ask the user to run the migration**

Do NOT run `npm run db:migrate` yourself. Tell the user the migration file is ready at `db/migrations/0001_education_grade_type.sql` and ask them to run `npm run db:migrate` (or confirm they'll do it) before the feature is fully live against their database. The rest of this plan's tasks can proceed and be typechecked/built without the migration having been applied yet, but the admin form won't work end-to-end against a live DB until it has.

- [ ] **Step 6: Commit**

```bash
git add db/schema.ts db/migrations/0001_education_grade_type.sql db/migrations/meta/_journal.json
git commit -m "feat: generalize education grade to support GPA or percentage"
```

---

## Task 2: Update `saveEducation` server action

**Files:**
- Modify: `app/admin/actions.ts:304-329`

**Interfaces:**
- Consumes: `education` table shape from Task 1 (`gradeValue`, `gradeScale`, `isPercentage`).
- Consumes: `str()` (returns `""` for null/empty) and `optStr()` (returns `null` for empty) helpers already defined at `app/admin/actions.ts:34-40`.
- Produces: `saveEducation(formData: FormData)` now reads a `gradingSystem` field (`"gpa"` or `"percentage"`) from the form instead of relying solely on raw `cgpa`/`cgpaScale` fields. Task 3's form must submit a field named `gradingSystem` with exactly these two string values, and fields named `gradeValue` / `gradeScale`.

- [ ] **Step 1: Update the function**

Find the current `saveEducation` function (lines 304-329):

```ts
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
  redirect("/admin/education?saved=1");
}
```

Replace it with:

```ts
export async function saveEducation(formData: FormData) {
  await assertAuth();
  const id = optStr(formData.get("id"));
  const isPercentage = str(formData.get("gradingSystem")) === "percentage";
  const gradeValue = str(formData.get("gradeValue"));
  const gradeScale = str(formData.get("gradeScale"));
  const values = {
    degree: str(formData.get("degree")),
    institution: str(formData.get("institution")),
    university: str(formData.get("university")),
    faculty: str(formData.get("faculty")),
    location: str(formData.get("location")),
    startDate: str(formData.get("startDate")),
    endDate: str(formData.get("endDate")),
    gradeValue: gradeValue ? Number(gradeValue) : null,
    gradeScale: !isPercentage && gradeScale ? Number(gradeScale) : null,
    isPercentage,
    description: str(formData.get("description")),
    sortOrder: Number(str(formData.get("sortOrder"))) || 0,
  };
  if (id) {
    await db.update(education).set(values).where(eq(education.id, Number(id)));
  } else {
    await db.insert(education).values(values);
  }
  revalidateSite();
  redirect("/admin/education?saved=1");
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors in `app/admin/actions.ts`. Errors should remain only in `app/admin/education/education-form.tsx`, `components/sections/education.tsx`, and `lib/resume/document.tsx` (fixed in Tasks 3-4).

- [ ] **Step 3: Commit**

```bash
git add app/admin/actions.ts
git commit -m "feat: parse grading system in saveEducation server action"
```

---

## Task 3: Update the admin education form

**Files:**
- Modify: `app/admin/education/education-form.tsx`

**Interfaces:**
- Consumes: `Education` type from Task 1 (`gradeValue`, `gradeScale`, `isPercentage`).
- Consumes: `Field` component from `app/admin/_components/fields.tsx` (props: `label`, `name`, `defaultValue`, `type`, `required`, `placeholder`, `hint`).
- Produces: a form that submits `gradingSystem` (`"gpa"` | `"percentage"`), `gradeValue`, `gradeScale` field names, matching what Task 2's `saveEducation` reads.

- [ ] **Step 1: Replace the CGPA fields with the grading-system select + renamed fields**

Find this block in `app/admin/education/education-form.tsx` (current lines 57-70):

```tsx
        <Field
          label="CGPA"
          name="cgpa"
          type="number"
          defaultValue={education?.cgpa}
          placeholder="3.51"
        />
        <Field
          label="CGPA scale"
          name="cgpaScale"
          type="number"
          defaultValue={education?.cgpaScale}
          placeholder="4.0"
        />
```

Replace it with:

```tsx
        <div className="space-y-1.5">
          <label
            htmlFor="gradingSystem"
            className="text-sm font-medium text-foreground"
          >
            Grading system
          </label>
          <select
            id="gradingSystem"
            name="gradingSystem"
            defaultValue={education?.isPercentage ? "percentage" : "gpa"}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          >
            <option value="gpa">GPA</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <Field
          label="Score"
          name="gradeValue"
          type="number"
          defaultValue={education?.gradeValue}
          placeholder="3.51 or 85"
        />
        <Field
          label="Scale"
          name="gradeScale"
          type="number"
          defaultValue={education?.gradeScale}
          placeholder="4.0"
          hint="Only used for GPA."
        />
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors in `app/admin/education/education-form.tsx`. Errors should remain only in `components/sections/education.tsx` and `lib/resume/document.tsx` (fixed in Task 4).

- [ ] **Step 3: Commit**

```bash
git add app/admin/education/education-form.tsx
git commit -m "feat: add grading system selector to education admin form"
```

---

## Task 4: Update public timeline and PDF resume rendering

**Files:**
- Modify: `components/sections/education.tsx:16-24`
- Modify: `lib/resume/document.tsx:270-289`

**Interfaces:**
- Consumes: `Education` type from Task 1 (`gradeValue`, `gradeScale`, `isPercentage`).

- [ ] **Step 1: Update the public timeline**

Find this block in `components/sections/education.tsx` (current lines 16-24):

```tsx
        {education.map((edu, i) => {
          const meta = [
            edu.university,
            edu.cgpa != null
              ? `CGPA ${edu.cgpa}${edu.cgpaScale ? `/${edu.cgpaScale}` : ""}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ");
```

Replace it with:

```tsx
        {education.map((edu, i) => {
          const grade =
            edu.gradeValue != null
              ? edu.isPercentage
                ? `${edu.gradeValue}%`
                : `CGPA ${edu.gradeValue}${edu.gradeScale ? `/${edu.gradeScale}` : ""}`
              : null;
          const meta = [edu.university, grade].filter(Boolean).join(" · ");
```

- [ ] **Step 2: Update the PDF resume**

Find this block in `lib/resume/document.tsx` (current lines 270-277 area, inside `renderEducation`):

```tsx
        {view.education.map((edu) => {
          const subLeft = [edu.degree, edu.faculty, edu.university]
            .filter(Boolean)
            .join(", ");
          const dateRange = formatDateRange(edu.startDate, edu.endDate, false);
          const cgpaText =
            edu.cgpa != null
              ? ` | CGPA: ${edu.cgpa}${edu.cgpaScale != null ? ` / ${edu.cgpaScale}` : ""}`
              : "";
```

Replace it with:

```tsx
        {view.education.map((edu) => {
          const subLeft = [edu.degree, edu.faculty, edu.university]
            .filter(Boolean)
            .join(", ");
          const dateRange = formatDateRange(edu.startDate, edu.endDate, false);
          const cgpaText =
            edu.gradeValue != null
              ? edu.isPercentage
                ? ` | ${edu.gradeValue}%`
                : ` | CGPA: ${edu.gradeValue}${edu.gradeScale != null ? ` / ${edu.gradeScale}` : ""}`
              : "";
```

(The rest of `renderEducation`, including where `cgpaText` is used in the JSX, stays unchanged — only the assignment changes.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors anywhere. This confirms every `cgpa`/`cgpaScale` reference in the repo has been migrated (the earlier `grep -rniI cgpa` sweep found only these 6 files across the whole codebase, and all 6 are now updated across Tasks 1-4).

- [ ] **Step 4: Full build**

Run: `npm run build`
Expected: Build succeeds with no type or lint errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/education.tsx lib/resume/document.tsx
git commit -m "feat: render percentage or GPA grade in timeline and PDF resume"
```

---

## Task 5: Manual verification

**Files:** None (verification only — no code changes).

**Interfaces:** None.

- [ ] **Step 1: Confirm the migration has been applied**

Ask the user to confirm `npm run db:migrate` has been run against their database (from Task 1, Step 5). Do not proceed with live DB testing until they confirm.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: Server starts on `http://localhost:3057` (or whatever port is configured) with no errors.

- [ ] **Step 3: Create a GPA-style entry**

In the browser, go to `/admin/education/new`. Fill in a degree/institution, set "Grading system" to `GPA`, "Score" to `3.51`, "Scale" to `4.0`. Submit.
Expected: Redirects to `/admin/education?saved=1`, no errors.

- [ ] **Step 4: Create a percentage-style entry**

Go to `/admin/education/new` again. Fill in a degree/institution, set "Grading system" to `Percentage`, "Score" to `85`, leave "Scale" blank. Submit.
Expected: Redirects to `/admin/education?saved=1`, no errors.

- [ ] **Step 5: Check the public timeline**

Visit the portfolio homepage (education section, or wherever `EducationSection` is rendered) in the browser.
Expected: The GPA entry shows `CGPA 3.51/4.0`; the percentage entry shows `85%`.

- [ ] **Step 6: Check the PDF resume**

From `/admin/resume`, generate/preview the PDF resume (or hit the `/api/resume` route, per however this project's resume builder is normally tested).
Expected: The GPA entry shows `| CGPA: 3.51 / 4.0`; the percentage entry shows `| 85%`.

- [ ] **Step 7: Edit an existing entry to switch grading system**

Edit the GPA entry created in Step 3, change "Grading system" to `Percentage`, change "Score" to `90`, leave the old "Scale" value (`4.0`) in place, and submit.
Expected: After saving, re-open the edit form — "Scale" should now be empty (confirms `saveEducation` correctly nulls `gradeScale` when `isPercentage` is true, per Task 2 Step 1), and the timeline/PDF should show `90%`, not a leftover `/4.0`.

---

## Self-Review Notes (completed during planning)

- **Spec coverage:** All 6 spec touch points (schema, migration, action, form, timeline, PDF) map to Tasks 1-4. The spec's "out of scope" items (no JS toggle, no other grading systems, no zod) are respected — none of the tasks add them.
- **Placeholder scan:** No TBD/TODO — every step has literal file paths, full before/after code blocks, and exact commands.
- **Type consistency:** `gradeValue`, `gradeScale`, `isPercentage` are used with identical names and types across Task 1 (schema), Task 2 (action), Task 3 (form), and Task 4 (render sites). `gradingSystem` (form field name, not a DB column) is consistently `"gpa"` | `"percentage"` between Task 2 and Task 3.
