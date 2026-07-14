# Fork-ready template: remove personal data from seed & static code

## Problem

The repo is a personal portfolio hardcoded around one person's data. Someone
forking it to build their own portfolio would need to hunt down and replace
personal content scattered across the seed script and a few static files.
The admin CRUD layer (profile, experience, projects, education, skills, and
their categories/types) already handles empty state gracefully — `ensureProfile()`
bootstraps a blank profile row, and every admin list page shows an "add your
first entry" empty state — so nothing in the DB layer *requires* personal data
to function. The only things standing in the way of a clean fork are:

1. `db/seed.ts` seeds the owner's real name, jobs, projects, education, and skills.
2. `app/layout.tsx` has a hardcoded page title/description with the owner's name.
3. `package.json`'s `name` field and `README.md`'s title reference the owner's domain.

A repo-wide grep for the owner's name/handles (`abhishek`, `ghimire`,
`cypherab01`, `aghimire074`) confirms these four files are the only hits.

## Changes

### 1. `db/seed.ts` — placeholder skeleton instead of personal data

Keep the script (idempotent wipe-and-reinsert, same shape as today) but
replace all content with obviously-fake placeholder data, minimal rather than
richly populated:

- **Profile**: name `"Your Name"`, initials `"YN"`, role `"Your Role"`,
  location `"Your City, Country"`, email `"you@example.com"`, empty
  phone/website/github/linkedin, generic headline/summary/about placeholder text.
- **Experience**: one `work` experience kind, one example experience entry
  with placeholder title/company/responsibilities/technologies.
- **Projects**: one project category, one example project with placeholder
  description/technologies.
- **Education**: one example education entry.
- **Skills**: two skill categories (e.g. "Languages", "Tools") with 1-2
  placeholder skills each.
- **Resume config**: built from the inserted ids, same as today (defaults to
  everything selected).

Someone forking runs `pnpm db:seed` once to see the site render with
obviously-fake example content, then edits or deletes it via `/admin`.

### 2. `app/layout.tsx` — dynamic metadata from the DB profile

Replace the static `metadata` export with an async `generateMetadata()` that
calls `getProfile()` (from `db/queries.ts`) and derives title/description from
the profile row:

- Title: `"{name} — {role}"` when a name is set, else falls back to a generic
  `"Portfolio"`.
- Description: `profile.summary` when set, else a generic fallback sentence.

This means the browser tab title and SEO description update automatically
once an admin fills in `/admin/profile` — no code edit needed, and it works
correctly whether the DB is freshly migrated (no profile row yet), seeded
with placeholders, or filled in with real data.

### 3. Cosmetic genericization

- `package.json`: rename `"name"` from `"abhishekg.info.np"` to a generic
  project name (e.g. `"portfolio"`).
- `README.md`: change the `#` title heading from `abhishekg.com.np` to a
  generic title, and reword the `db:seed` step description to say
  "placeholder/example content" rather than implying it's the owner's data.

## Out of scope

`next.config.ts`, `proxy.ts`, `.env.example`, `drizzle.config.ts`, DB schema,
queries, and admin CRUD pages are already generic — confirmed via grep, no
personal data or branding found there.

## Testing

- `pnpm db:seed` runs cleanly against a dev DB and produces the placeholder
  rows described above.
- Visiting `/` and `/about` with a freshly seeded DB shows placeholder content,
  no owner-specific strings.
- Browser tab title reflects the seeded placeholder profile
  (`"Your Name — Your Role"`), then updates after editing `/admin/profile`.
- Repo-wide grep for the owner's name/handles returns no results outside git
  history.
