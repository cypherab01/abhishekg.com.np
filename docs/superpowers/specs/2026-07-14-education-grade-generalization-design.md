# Education grade generalization — design

## Problem

The `education` table only supports GPA-style grades (`cgpa` + `cgpaScale`, both nullable `real`). Some institutions report a percentage instead of a GPA/CGPA, which the current schema, admin form, public timeline, and PDF resume cannot represent — everything is hard-coded to render `CGPA {value}/{scale}`.

## Goal

Let each education entry store either a GPA-style score (with an optional scale, e.g. out of 4.0) or a percentage score, and render the correct format everywhere the value appears: the admin form, the public portfolio timeline, and the generated PDF resume.

## Schema change (`db/schema.ts`)

Replace `cgpa`/`cgpaScale` on the `education` table with:

- `gradeValue: real("grade_value")` — nullable; the numeric score itself (e.g. `3.51` or `85`)
- `gradeScale: real("grade_scale")` — nullable; only meaningful when `isPercentage` is `false` (e.g. `4.0`); always stored as `null` for percentage entries
- `isPercentage: boolean("is_percentage").notNull().default(false)` — discriminates GPA vs percentage

A boolean flag was chosen over a text/enum discriminator because this schema already uses booleans for binary states elsewhere (`experiences.current`, `projects.featured`, `messages.read`), and there are only ever two grading systems to represent.

## Migration

Hand-written SQL (per project convention: never run `drizzle-kit generate`, migrations are hand-authored), added as the next numbered file in `db/migrations/`:

```sql
ALTER TABLE "education" RENAME COLUMN "cgpa" TO "grade_value";
ALTER TABLE "education" RENAME COLUMN "cgpa_scale" TO "grade_scale";
ALTER TABLE "education" ADD COLUMN "is_percentage" boolean NOT NULL DEFAULT false;
```

Existing rows default to `is_percentage = false`, which is correct since all prior data was GPA-only. The user runs `db:migrate` themselves — this is not run automatically as part of implementation.

## Server action (`app/admin/actions.ts` — `saveEducation`)

- Read a new `gradingSystem` form field (`"gpa" | "percentage"`).
- Derive `isPercentage = gradingSystem === "percentage"`.
- Parse `gradeValue` as before (`Number(str(...))` or `null`).
- Parse `gradeScale` only when `!isPercentage`; force it to `null` when percentage is selected, so a leftover scale value from a prior edit can't leak into a percentage entry.

## Admin form (`app/admin/education/education-form.tsx`)

No existing admin form (`experience-form.tsx`, `project-form.tsx`, `skill-form.tsx`) conditionally shows/hides a field based on another field's value — all are plain server components with no client-side state. To stay consistent with that style, the new fields are always visible (no JS toggle):

- A native `<select name="gradingSystem">` with options "GPA" / "Percentage" (same visual treatment as the existing category/kind `<select>` elements), `defaultValue` derived from `education?.isPercentage`.
- `Field label="Score" name="gradeValue" type="number"` (replaces the old "CGPA" field).
- `Field label="Scale" name="gradeScale" type="number" hint="Only used for GPA."` (replaces the old "CGPA scale" field) — left visible but ignored server-side when percentage is selected.

## Display logic

Both render sites keep their own existing punctuation conventions, just branching on `isPercentage`:

**`components/sections/education.tsx`** (public timeline):
```ts
const grade =
  edu.gradeValue != null
    ? edu.isPercentage
      ? `${edu.gradeValue}%`
      : `CGPA ${edu.gradeValue}${edu.gradeScale ? `/${edu.gradeScale}` : ""}`
    : null;
```

**`lib/resume/document.tsx`** (PDF resume):
```ts
const gradeText =
  edu.gradeValue != null
    ? edu.isPercentage
      ? ` | ${edu.gradeValue}%`
      : ` | CGPA: ${edu.gradeValue}${edu.gradeScale != null ? ` / ${edu.gradeScale}` : ""}`
    : "";
```

No shared formatting helper is introduced — the two call sites already had independently duplicated formatting logic before this change (different spacing/labels), so keeping them separate matches existing style rather than forcing a premature abstraction.

## Touch points (confirmed exhaustive via `grep -rniI cgpa`)

1. `db/schema.ts` — column rename + new column
2. `db/migrations/000X_*.sql` — new hand-written migration
3. `app/admin/actions.ts` — `saveEducation`
4. `app/admin/education/education-form.tsx` — form fields
5. `components/sections/education.tsx` — public timeline rendering
6. `lib/resume/document.tsx` — PDF resume rendering

`db/seed.ts` has no education seed data referencing these columns, so it needs no change. `app/admin/education/education-list.tsx` doesn't display the grade at all today, so it's unaffected.

## Out of scope

- No client-side JS toggle to hide the "Scale" field when Percentage is selected (see rationale above).
- No support for other grading systems (letter grades, honors/divisions) — only GPA and percentage, per the stated problem.
- No zod validation is being added; `saveEducation` already had none for `cgpa`/`cgpaScale`, and this change doesn't expand that scope.
