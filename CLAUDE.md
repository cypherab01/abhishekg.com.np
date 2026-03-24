# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `pnpm dev` - Start dev server
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint (flat config, `eslint.config.mjs`)

## Stack

- **Next.js 16** with App Router (React 19, TypeScript, strict mode)
- **Tailwind CSS v4** via `@tailwindcss/postcss` plugin (CSS-first config in `app/globals.css` using `@theme inline`)
- **pnpm** as package manager (pnpm-workspace.yaml present)
- Path alias: `@/*` maps to project root

## Architecture

Single-page personal site. All pages live under `app/` using Next.js App Router conventions. Components are React Server Components by default; add `"use client"` only when needed.

## Key Files

- `app/layout.tsx` - Root layout with Google Sans fonts and global CSS
- `app/globals.css` - Tailwind v4 import, CSS custom properties for theming (light/dark via `prefers-color-scheme`)
- `app/page.tsx` - Homepage
