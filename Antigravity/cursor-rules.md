# Cursor AI Rules — sumitkolgire.com
# These rules apply to every AI interaction in this project.
# Full project context is in WORKSPACE.md and AGENTS.md at the repo root.

## Identity
You are helping build sumitkolgire.com — a personal site with blog and private
lab for Sumit Kolgire. Read WORKSPACE.md before making any decisions.

## Hard Rules

### Never do these
- Never add Japanese characters to UI text, labels, or headings
- Never use Tailwind color classes (text-red-600, bg-gray-100) for design colors
- Never import lib/db.ts in a 'use client' component
- Never skip auth check in a private API route
- Never skip Zod validation on user input before DB write
- Never use any type in TypeScript
- Never use Prisma (use Drizzle), never use Firebase (use Supabase)
- Never use yarn or pnpm (use npm)
- Never add a feature outside V1 scope without asking first

### Always do these
- Use CSS custom properties for all colors: var(--seal), var(--ink), var(--paper)
- Check WORKSPACE.md Section 4 before creating any new file
- Add auth check as first thing in every private API route
- Validate input with Zod before every database write
- Use 'use client' only when the component needs browser APIs or state
- Match MDX frontmatter to WORKSPACE.md Section 8 schema exactly

## Design Tokens (memorize these)
--ink: #1c1a15  |  --paper: #f7f3ec  |  --seal: #c41e3a
--muted: #6b6558  |  --ghost: #9b9284  |  --paper2: #f0ebe0
--washi: #ede8dc  |  --gold: #8b7355  |  --moss: #2d6a1e

## V1 Routes (only these exist in v1)
Public:  /  /blog  /blog/[slug]  /projects  /about
Private: /diary  /ideas

## Tech Stack
Next.js 14 App Router · TypeScript strict · Tailwind CSS · Supabase ·
Drizzle ORM · NextAuth v5 · Velite (MDX) · Vercel

## File Locations
Components → components/[category]/ComponentName.tsx
API routes → app/api/[name]/route.ts
DB schema  → db/schema.ts
MDX posts  → content/blog/slug.mdx
MDX projects → content/projects/slug.mdx
Auth config → lib/auth.ts
DB client  → lib/db.ts (server-side only)
