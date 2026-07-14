# Portfolio

A dynamic, database-backed personal portfolio built with **Next.js 16**, **Drizzle ORM**, **Neon PostgreSQL**, and **UploadThing**. All content — profile, experience, teaching, projects, education, skills, and contact messages — is stored in Postgres and managed through a password-protected admin dashboard.

Fork this repo to build your own: the page title/description are pulled live from your profile row (no code edits needed), and every admin section starts empty with an "add your first entry" prompt, so there's no personal data to clean up.

## Tech Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **Drizzle ORM** + **Neon** (serverless PostgreSQL)
- **UploadThing** for resume (PDF) and image uploads
- **Tailwind CSS v4** + shadcn-style UI
- **jose** for a signed session-cookie based single-admin login

## Getting Started

### 1. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
DATABASE_URL='postgresql://...'      # Neon connection string
UPLOADTHING_TOKEN='...'              # UploadThing app token
ADMIN_PASSWORD='<sha-256 hex>'       # SHA-256 hash of the /admin password (never the plain password)
AUTH_SECRET='...'                    # random 32+ byte hex (openssl rand -hex 32)
NEXT_PUBLIC_APP_URL='http://localhost:3000'
```

`ADMIN_PASSWORD` stores a **SHA-256 hex digest**, not the password itself. Generate it on Linux with:

```bash
printf '%s' 'your-strong-password' | sha256sum | awk '{print $1}'
```

### 2. Database

```bash
pnpm db:migrate    # apply migrations to Neon
pnpm db:seed       # seed placeholder/example content (idempotent — wipes & re-inserts)
pnpm db:studio     # (optional) open Drizzle Studio to browse/edit data
```

Migrations in `db/migrations/` are hand-written directly against `db/schema.ts` rather than produced with `drizzle-kit generate` — if you change the schema, add a new migration file by hand and a matching entry in `db/migrations/meta/_journal.json`.

### 3. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The admin dashboard lives at
[http://localhost:3000/admin](http://localhost:3000/admin) (redirects to `/admin/login`).

## Structure

```
app/
  (site)/            # public site (shares Navbar + Footer layout)
    page.tsx         # home — hero, experience, projects, education, skills, contact
    about/           # full about page (bio, experience, teaching, education, skills)
    projects/        # projects index + [slug] detail pages
  admin/             # password-protected dashboard (CRUD + uploads)
    login/           # login page + server action
    profile|experience|projects|education|skills|messages/
  api/uploadthing/   # UploadThing file router (resume + images)
  actions/contact.ts # public contact-form server action
db/
  schema.ts          # Drizzle tables
  queries.ts         # read helpers used by public pages
  seed.ts            # seed script
lib/
  auth.ts            # session create/verify (jose)
  uploadthing.ts     # client upload helpers
  proxy.ts        # protects /admin/*
```

## Admin

- Sign in at `/admin/login` with the password whose SHA-256 hash is stored in `ADMIN_PASSWORD`.
- Manage every section, upload a resume PDF and images (project covers, avatar).
- Edits call `revalidatePath('/', 'layout')`, so the public site updates immediately.

## Deploy on Vercel

Set all `.env` variables in the Vercel project settings, then deploy. Run
`pnpm db:migrate` against your production database before the first deploy.
