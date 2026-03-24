# Portfolio Website Design Spec

## Overview
Single-page scroll portfolio for Abhishek Ghimire at abhishekg.com.np. Minimal & clean aesthetic with timeline elements for experience/education. Dark/light theme via next-themes.

## Tech Stack
- Next.js 16 (App Router, existing project)
- shadcn/ui (base: zinc, theme: blue)
- next-themes (ThemeProvider)
- Tailwind CSS v4

## Sections (top to bottom)
1. **Navbar** — sticky, "AG" logo left, section links + theme toggle right, mobile hamburger menu
2. **Hero** — role label (blue), name (large, light weight), tagline, GitHub + Contact CTA buttons
3. **About** — short bio paragraph
4. **Experience** — vertical timeline with blue dot markers, company/role/description + tech badges per entry
5. **Projects** — 2-column card grid, bordered cards with title + description
6. **Education** — vertical timeline (same style as experience)
7. **Skills** — outline badge pills, wrapped flex layout
8. **Contact/Footer** — "Let's work together" + email, social links

## Design Tokens
- Base color: zinc (shadcn)
- Accent: blue (`--primary` mapped to blue)
- Dark mode default, light mode supported via toggle
- Section separators: subtle top border (`border-border`)

## Component Structure
```
components/
  layout/
    navbar.tsx          — sticky nav with mobile menu + theme toggle
    footer.tsx          — contact section + social links
    section.tsx         — reusable section wrapper (id, title, children)
  sections/
    hero.tsx            — hero content
    about.tsx           — about paragraph
    experience.tsx      — experience timeline
    projects.tsx        — project cards grid
    education.tsx       — education timeline
    skills.tsx          — skills badges
  ui/
    timeline.tsx        — reusable timeline component (dot + line + content slot)
    project-card.tsx    — bordered card for projects
    badge.tsx           — shadcn badge (already provided)
    theme-toggle.tsx    — dark/light toggle button
    mobile-nav.tsx      — mobile navigation sheet/drawer
  theme-provider.tsx    — next-themes wrapper
lib/
  data.ts              — all portfolio data as typed constants
```

## Data Layer
All portfolio content lives in `lib/data.ts` as typed constants — no CMS, no API. Sections import from this single source.

## Reusability Principles
- `Section` component wraps every section (consistent spacing, id for scroll nav, title rendering)
- `Timeline` component shared between Experience and Education
- `ProjectCard` reusable for any card-style content
- Data separated from presentation — components receive props, data lives in `lib/data.ts`
