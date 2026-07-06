# abhishekg.com.np

A dynamic, database-backed personal portfolio built with **Next.js 16**, **Drizzle ORM**, **Neon PostgreSQL**, and **UploadThing**. All content — profile, experience, teaching, projects, education, skills, and contact messages — is stored in Postgres and managed through a password-protected admin dashboard.

## Tech Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **Drizzle ORM** + **Neon** (serverless PostgreSQL)
- **UploadThing** for resume (PDF) and image uploads
- **Tailwind CSS v4** + shadcn-style UI
- **jose** for a signed session-cookie based single-admin login

## Getting Started

### 1. Environment variables

Copy `.env.sample` to `.env` and fill in the values:

```bash
DATABASE_URL='postgresql://...'      # Neon connection string
UPLOADTHING_TOKEN='...'              # UploadThing app token
ADMIN_PASSWORD='your-strong-password' # password for the /admin dashboard
AUTH_SECRET='...'                    # random 32+ byte hex (openssl rand -hex 32)
NEXT_PUBLIC_APP_URL='http://localhost:3000'
```

### 2. Database

```bash
pnpm db:generate   # generate SQL migrations from db/schema.ts
pnpm db:migrate    # apply migrations to Neon
pnpm db:seed       # seed initial content (idempotent — wipes & re-inserts)
pnpm db:studio     # (optional) open Drizzle Studio to browse/edit data
```

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
middleware.ts        # protects /admin/*
```

## Admin

- Sign in at `/admin/login` with `ADMIN_PASSWORD`.
- Manage every section, upload a resume PDF and images (project covers, avatar).
- Edits call `revalidatePath('/', 'layout')`, so the public site updates immediately.

## Deploy on Vercel

Set all `.env` variables in the Vercel project settings, then deploy. Run
`pnpm db:migrate` against your production database before the first deploy.
