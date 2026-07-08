# Admin Resume Builder — Design

## Goal

Add an admin section that generates a one-page A4 PDF resume from the site's
existing data (profile, experience, education, skills, projects), letting the
admin pick exactly what to include, preview it, and save the configuration.
The public front page gets a "Download Resume" button that renders the saved
configuration into a PDF on demand.

## Data model

New singleton table `resume_config` (same singleton pattern as `profile`,
`id = 1`):

| column         | type                                   | notes                                                   |
|----------------|----------------------------------------|----------------------------------------------------------|
| id             | integer PK, default 1                  | singleton row                                             |
| summary        | text, default ""                       | resume-specific summary, independent of `profile.summary` |
| sections       | jsonb `{ key: SectionKey; visible: boolean }[]` | display order + visibility; order = array order    |
| headerFields   | jsonb `Record<HeaderField, boolean>`   | phone/email/website/github/linkedin/location toggles       |
| experienceIds  | jsonb `number[]`                       | explicit opt-in list of `experiences.id`                   |
| educationIds   | jsonb `number[]`                       | explicit opt-in list of `education.id`                     |
| skillIds       | jsonb `number[]`                       | explicit opt-in list of `skills.id`                         |
| projectIds     | jsonb `number[]`                       | explicit opt-in list of `projects.id`                       |
| updatedAt      | timestamp, default now                 |                                                             |

`SectionKey = "summary" | "experience" | "education" | "skills" | "projects"`.
`HeaderField = "phone" | "email" | "website" | "github" | "linkedin" | "location"`
(name is always shown, never toggleable).

Selection is explicit opt-in: an item not present in the relevant ID array is
excluded. Newly created content (e.g. a new project) is excluded by default
until the admin visits the builder and checks it — this is a deliberate
choice so new content doesn't silently appear on a public resume.

Within the rendered "Experience" section, selected experiences are grouped by
their existing `experienceKinds` relation (e.g. "Work" vs "Teaching &
Mentoring"), ordered by that kind's existing `sortOrder`. This mirrors the
structure of the previous LaTeX resume without needing separate top-level
reorderable sections per kind.

`profile.resumeUrl` is removed (column + all references) — it was unused dead
schema for a manual-upload flow that this feature replaces.

## Admin UI

New page `app/admin/resume/page.tsx`, added to `adminNavLinks` /
`AdminSidebar` as "Resume" (FileText icon).

Two-column layout (like Profile): builder form on the left, sticky live
preview pane on the right. This is a client component seeded with
server-fetched data (all experiences, education, skills, projects, and the
existing config or sensible "everything selected" defaults if no config row
exists yet).

Builder form fields:

- **Summary** — textarea, defaults to `profile.summary` on first creation of
  the config, editable independently thereafter.
- **Header fields** — checkboxes: Phone, Email, Website, GitHub, LinkedIn,
  Location.
- **Sections** — a drag-reorderable list of the 5 section keys, each with a
  visibility toggle. Drag order determines PDF order.
- **Content pickers** — one checklist per data type, each row labeled with
  enough identifying detail (title + dates, or name):
  - Experience, grouped under its kind's heading
  - Education
  - Skills, grouped under their category heading (a category with zero
    checked skills simply doesn't render)
  - Projects
- **Preview** button — POSTs the current in-form (unsaved) state to
  `/api/resume/preview` and renders the returned PDF in an iframe.
- **Save settings** button — persists the form state to `resume_config` via a
  server action (`saveResumeConfig` in `app/admin/actions.ts`).

## PDF generation engine

New `lib/resume/` module:

- `lib/resume/types.ts` — shared types (`ResumeConfig`, `SectionKey`,
  `HeaderField`, the resolved-data shape passed into the document).
- `lib/resume/fonts.ts` — registers Inter (Regular 400, Medium 500, SemiBold
  600, Bold 700) with `@react-pdf/renderer`'s `Font.register`, reading static
  TTFs from the `@fontsource/inter` package. Guarded so registration only
  runs once per process.
- `lib/resume/document.tsx` — the `<Document>`/`<Page>` React-pdf tree. Page
  size A4, ~28pt (0.4in) margins on all sides. Renders the header/contact
  row, then each visible section in configured order, sub-grouping
  experience by kind. Accepts a `tier` prop controlling base font size and
  spacing.
- `lib/resume/build.ts` — `buildResumePdf(config, data, filename)`: renders
  at a "comfortable" tier, checks the resulting page count with `pdf-lib`; if
  more than 1 page, re-renders at "compact", then "dense", keeping the
  smallest tier that fits on one page (or "dense" regardless, if the content
  is simply too much for one page — it's then allowed to spill to page 2
  rather than becoming illegibly small). Returns a `Buffer`.
- `lib/resume/data.ts` — fetches and shapes all underlying data (profile +
  experience groups + education + skill groups + projects) needed to render,
  independent of which config is applied.

## Routes

- `POST /api/resume/preview` — admin-auth gated (`isAuthenticated()` from
  `lib/auth`). Body: the draft `ResumeConfig` JSON from the in-progress
  builder form. Fetches current underlying data, builds the PDF, returns it
  inline (`Content-Disposition: inline`) for the iframe preview.
- `GET /api/resume` — public. Loads the saved `resume_config` row (creating a
  sensible default — all content selected, all sections visible — if none
  exists yet, mirroring the `ensureProfile` pattern), builds the PDF, and
  streams it as an attachment (`Content-Disposition: attachment;
  filename="<Name>-Resume.pdf"`).

## Front-end integration

`components/sections/hero-cta.tsx` gains a "Download Resume" link (Download
icon from lucide-react) next to GitHub / Get in Touch, pointing at
`/api/resume`, styled with the existing `buttonVariants` outline style.

## New dependencies

- `@react-pdf/renderer` — PDF generation.
- `pdf-lib` — page-count check for the fit-to-one-page retry loop.
- `@fontsource/inter` — static Inter TTF assets (not imported for CSS, just
  used as a source of font files).
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — section
  drag-reorder in the admin builder.
- `next.config.ts` gets an `outputFileTracingIncludes` entry for the resume
  API routes, to guarantee the Inter font files are bundled into the
  serverless function output regardless of trace inference.

## Out of scope

- Multiple named resume variants (only one singleton config).
- Manual PDF upload / override.
- Reordering items *within* a section (only section-level reordering).
- Formats other than PDF.
