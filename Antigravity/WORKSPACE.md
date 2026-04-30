# WORKSPACE.md
# sumitkolgire.com — AI Agent Working Rules

> **This file is the single source of truth for any AI agent, coding assistant,
> or automated tool working on this project. Read it completely before touching
> any file. Do not make assumptions. Do not skip sections.**

---

## 0. PROJECT IDENTITY

```
Owner          : Sumit Kolgire
Domain         : sumitkolgire.com
GitHub repo    : github.com/SumitKolgire/sumitkolgire.com
Purpose        : Personal site — writing, projects, private lab diary
Theme          : Japanese Wabi-Sabi aesthetic — English language only
Stack          : Next.js 14 · TypeScript · Tailwind CSS · Supabase · Drizzle ORM
Deployed on    : Vercel (Hobby plan)
Node version   : 18.x or higher (required by Next.js 14)
Package manager: npm (not yarn, not pnpm — npm only)
```

---

## 1. WHAT THIS PROJECT IS

A **personal site with a blog and private lab**. Not a SaaS product. Not a
platform. Not a startup.

It has two distinct zones:

```
PUBLIC ZONE  — visible to everyone, no login
  /              Home
  /blog          All posts (articles + perspectives + docs combined)
  /blog/[slug]   Single post
  /projects      Portfolio
  /about         About page

PRIVATE LAB  — auth-gated, only Sumit can access
  /diary         Daily lab journal
  /ideas         Raw ideas wall
```

**V1 scope is intentionally small.** If you are asked to add a feature not in
the route list above, ask for explicit confirmation before building it. Do not
gold-plate. Do not add things "while you're at it."

---

## 2. WHAT THIS PROJECT IS NOT

- Not a multi-user platform. There is ONE admin user (Sumit).
- Not a multi-tenant system. One domain, one person.
- Not a SaaS. No pricing pages, no subscription tiers, no user accounts for visitors.
- Not a React Native / mobile app. Web only.
- Not using Prisma. Use Drizzle ORM only.
- Not using Firebase. Use Supabase (PostgreSQL) only.
- Not using Contentlayer or Velite. Use Sanity.io for content management.
- Not using pnpm or yarn. Use npm only.
- Not using Framer Motion unless explicitly requested. Use CSS animations + IntersectionObserver.
- Not using Japanese characters anywhere in the UI. English only, Wabi-Sabi style.

---

## 3. DESIGN SYSTEM — NON-NEGOTIABLE

### 3.1 Theme Philosophy
The site uses Japanese Wabi-Sabi aesthetics expressed entirely in English.
This means: imperfection as beauty, silence as signal, negative space as
intentional. Clean. Restrained. Never busy.

### 3.2 Design Tokens (exact values — do not invent new ones)

```css
/* Colors */
--ink:    #1c1a15    /* primary text, nav bg, footer bg */
--ink2:   #2c2925    /* hover states on dark elements */
--muted:  #6b6558    /* secondary text, descriptions */
--ghost:  #9b9284    /* tertiary text, dates, labels */
--paper:  #f7f3ec    /* primary background */
--paper2: #f0ebe0    /* section alternates, card backgrounds */
--paper3: #e8e0d0    /* deeper card backgrounds, idea cards */
--washi:  #ede8dc    /* hover states on light elements */
--seal:   #c41e3a    /* accent — links, highlights, seal stamp */
--gold:   #8b7355    /* border color, ruled lines */
--gold2:  #c8a96e    /* warm accent, idea ripeness indicator */
--moss:   #2d6a1e    /* success, active status, streak */
--sky:    #1d4ed8    /* info, links on dark bg */

/* Typography */
--serif:  'Shippori Mincho', Georgia, serif          /* headings, display */
--bask:   'Libre Baskerville', Georgia, serif        /* body text, prose */
--mono:   'DM Mono', 'Courier New', monospace        /* labels, code, dates */
```

### 3.3 Typography Rules
- **Headings**: Shippori Mincho (serif variable). Never bold system fonts.
- **Body prose**: Libre Baskerville. `font-size: 16px`, `line-height: 1.8`.
- **Labels, badges, dates, code**: DM Mono. `font-size: 10–12px`, `letter-spacing: 0.08–0.15em`.
- **Font subsets**: Load `subset: ['latin']` only — never full Japanese character set (file too large).
- **Font sizes**: Use only `clamp()` or fixed rem values. Never `px` for font sizes in Tailwind.

### 3.4 Wabi-Sabi Visual Rules
- **Ruled paper background**: CSS `repeating-linear-gradient(transparent, transparent 27px, rgba(139,115,85,.07) 28px)` on `body::before`, `position: fixed`, `z-index: 0`.
- **Section background alternation**: paper → paper2 → paper → paper2. Never skip the pattern.
- **Seal stamp**: SVG circle, `stroke: var(--seal)`, never filled. Used sparingly — max 1 per section.
- **Dividers**: `1px solid rgba(139,115,85,.15)` — never `border-black` or `border-gray`.
- **Hover states**: `background: var(--washi)` on light elements. `background: var(--ink2)` on dark elements.
- **Animations**: Fade up (`opacity: 0 → 1, translateY: 20px → 0`). Never slide sideways. Never bounce.
- **Borders**: `border: 1px solid rgba(139,115,85,.16)` — always use the gold token at low opacity, never Tailwind `border-gray`.
- **No Japanese characters** in UI text, navigation, labels, or headings. This is strict.

### 3.5 Tailwind Usage Rules
- Use Tailwind utility classes for layout and spacing.
- Use CSS custom properties (`var(--seal)`) for all colors — not Tailwind color classes like `text-red-600`.
- Do not use arbitrary Tailwind values like `bg-[#c41e3a]`. Use CSS variables instead.
- Never use `!important`.
- Dark mode: not implemented. This is a light (paper) site only.

---

## 4. FOLDER STRUCTURE — EXACT

Do not create files outside these paths without explicit instruction.

```
sumitkolgire.com/
├── app/
│   ├── (public)/                  ← SSG routes — no auth
│   │   ├── page.tsx               ← / Home
│   │   ├── blog/
│   │   │   ├── page.tsx           ← /blog
│   │   │   └── [slug]/page.tsx    ← /blog/[slug]
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── about/page.tsx
│   ├── (private)/                 ← SSR + Supabase Auth
│   │   ├── lab-diary/page.tsx
│   │   └── ideas/page.tsx
│   ├── api/
│   │   ├── subscribe/route.ts
│   │   └── draft-mode/route.ts    ← Sanity draft mode
│   ├── studio/                    ← Embedded Sanity Studio
│   │   ├── [[...tool]]/page.tsx
│   ├── login/page.tsx
│   ├── layout.tsx                 ← Root layout
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── sitemap.ts
│   └── robots.ts
│
├── sanity/                        ← Sanity schemas & config
│   ├── schemas/                   ← Content type schemas
│   │   ├── post.ts
│   │   └── project.ts
│   ├── env.ts
│   └── lib/                       ← Sanity client & queries
│       ├── client.ts
│       └── queries.ts
│
├── components/
│   ├── layout/
│   │   ├── SiteNavbar.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── MobileMenu.tsx
│   │   └── PageWrapper.tsx
│   ├── wabi/                      ← Design system primitives
│   │   ├── SealStamp.tsx
│   │   ├── BrushDivider.tsx
│   │   ├── RuledCard.tsx
│   │   └── DropCap.tsx
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   ├── PostPage.tsx
│   │   ├── TableOfContents.tsx
│   │   └── CodeBlock.tsx
│   ├── diary/
│   │   ├── DiaryEntryCard.tsx
│   │   ├── CalendarHeatmap.tsx
│   │   ├── EntryEditor.tsx
│   │   └── MoodFilter.tsx
│   ├── ideas/
│   │   ├── IdeaWall.tsx
│   │   ├── IdeaCard.tsx
│   │   └── RipenessIndicator.tsx
│   └── shared/
│       ├── NewsletterForm.tsx
│       └── ReadingProgressBar.tsx
│
├── lib/
│   └── db.ts                      ← Drizzle client (server-side only)
│
├── db/
│   ├── schema.ts                  ← All Drizzle table definitions
│   └── migrations/                ← Auto-generated — never edit manually
│
├── styles/
│   └── globals.css
│
├── sanity.config.ts               ← Embedded Studio config
├── middleware.ts                  ← Supabase SSR Auth
├── next.config.ts
├── drizzle.config.ts
├── .env.local                     ← NEVER commit — in .gitignore
├── .env.example                   ← Commit this — no real values
└── WORKSPACE.md                   ← This file — always at root
```

---

## 5. TECHNOLOGY RULES

### 5.1 Next.js
- App Router only. Never use `pages/` directory.
- Use Server Components by default. Add `'use client'` only when genuinely needed (event handlers, browser APIs, useState).
- Do not use `getServerSideProps` or `getStaticProps` — those are Pages Router patterns.
- `generateStaticParams()` for all `[slug]` routes.
- `generateMetadata()` for all page files — title, description, OG image URL minimum.

### 5.2 TypeScript
- Strict mode: `"strict": true` in tsconfig.json.
- No `any` types. Ever. If you don't know the type, infer it or use `unknown`.
- No `@ts-ignore`. Fix the type error properly.
- Export all component prop types as named interfaces.

### 5.3 Database (Drizzle + Supabase)
- All DB operations in server-side code only (API routes, Server Components, Server Actions).
- Never import `lib/db.ts` in a client component.
- Use parameterised queries via Drizzle — never string-interpolate user input into SQL.
- Validate all user input with Zod before any DB write.

### 5.4 Authentication (Supabase Auth)
- Single user (OWNER).
- Use `@supabase/ssr` middleware to protect `/lab-diary` and `/ideas` routes.
- Access session via `createClient().auth.getUser()`.
- No NextAuth usage.

### 5.5 Content (Sanity.io)
- All blog posts and project case studies are managed in Sanity.io.
- The Sanity Studio is accessible at `/studio`.
- Use GROQ to query content in Server Components.
- Use `PortableText` for rendering content blocks.

---

## 6. CODE STYLE RULES

### 6.1 Naming Conventions
- **Components**: PascalCase. `PostCard.tsx`, `SealStamp.tsx`, `EntryEditor.tsx`
- **Hooks**: camelCase with `use` prefix. `useScrollReveal.ts`, `useStreak.ts`
- **Utilities**: camelCase. `formatDate.ts`, `readingTime.ts`
- **API routes**: `route.ts` inside descriptive folder. `/api/diary/route.ts`
- **Types**: PascalCase with descriptive names. `DiaryEntry`, `PostMetadata`, `IdeaCard`
- **Database tables**: snake_case in schema. `diary_entries`, `post_views`
- **CSS classes**: Tailwind utilities + `globals.css` for custom properties only

### 6.2 Component Structure
Every component file follows this order:
```typescript
// 1. Imports (external first, internal second)
import { useState } from 'react'
import { PostCard } from '@/components/blog/PostCard'

// 2. Type definitions
interface Props {
  title: string
  slug: string
}

// 3. Component function
export function PostCard({ title, slug }: Props) {
  // 4. Hooks first
  // 5. Event handlers
  // 6. Return JSX
}
```

### 6.3 Comments
- Write comments for **why**, not **what**. The code shows what — comments explain why.
- Every API route must have a one-line comment at the top: `// POST /api/diary — creates a new diary entry, requires auth`
- Every complex Drizzle query needs a comment explaining the join or filter logic.

### 6.4 Error Handling
- All API routes wrap logic in `try/catch` and return proper HTTP status codes.
- Never return a 200 with `{ error: "..." }` inside. Use proper status codes: 400 (bad input), 401 (no auth), 403 (forbidden), 404 (not found), 500 (server error).
- Log errors with `console.error()` in development. In production, errors go to Vercel logs.

---

## 7. SECURITY RULES — MANDATORY

These are not suggestions. Every rule applies to every piece of code.

```
RULE S1: .env.local is in .gitignore. ALWAYS. Check before first commit.

RULE S2: Never import lib/db.ts or lib/auth.ts in any file with 'use client'.
         Database and auth are server-side only.

RULE S3: Every private API route checks session before doing anything else.
         No exceptions. Not even for "simple" read operations.

RULE S4: All user input is validated with Zod before touching the database.
         Even if the data looks safe. Even if it comes from a select dropdown.

RULE S5: Never expose OPENAI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, GITHUB_PAT,
         or NEXTAUTH_SECRET in any client-side code, console.log, or response body.

RULE S6: Rate limit these endpoints with Upstash: /api/subscribe (3/IP/hr),
         /api/auth login (5 attempts/IP/15min), /api/reactions (1/IP/post/day).

RULE S7: Sanitize HTML content before storing or rendering.
         Use DOMPurify for diary entries and idea content.

RULE S8: robots.txt must disallow: /diary, /ideas, /admin, /login, /api
         These should never be indexed by search engines.
```

---

## 8. SANITY SCHEMA CONTRACT

All public content is structured in Sanity.

**Post Schema Requirements:**
- `title`: string
- `slug`: string (auto-generated from title)
- `publishedAt`: datetime
- `type`: article | perspective | doc | project
- `tags`: array of strings
- `excerpt`: text (max 160 chars)
- `readingTime`: number
- `mainImage`: image
- `body`: PortableText

---

## 9. APPROVED TAG TAXONOMY

Only use tags from this list. Do not invent new tags without updating this list.

```
Technical:    AI, ML, Deep Learning, NLP, Agents, System Design, Architecture,
              Python, TypeScript, Next.js, FastAPI, PyTorch, LangChain,
              Database, Backend, Frontend, Full Stack, DevOps

Domain:       Multi-Agent, Brain-Computer Interface, Automation, Research,
              Distributed Systems, Web Development, Open Source

Conceptual:   POV, Philosophy, Career, Learning, Productivity, Creativity,
              Wabi-Sabi, Building in Public

Projects:     NOVELMAN, GrowthMate, ClickAnywhere, Caption Generator,
              Root Cause Analyzer, Multi-Agent Lab
```

---

## 10. DATABASE SCHEMA CONTRACT

The Drizzle schema in `db/schema.ts` defines these tables. Do not add columns
or tables without updating this file AND this workspace document.

```
diary_entries   → id, user_id, content, mood, is_public, written_at, word_count
ideas           → id, user_id, content, ripeness, tags, planted_at, is_archived
subscribers     → id, email, subscribed_at, status, source
post_views      → id, slug (unique), count, updated_at
reactions       → id, post_slug, reaction_type, ip_hash, created_at
resources       → id, title, url, domain, personal_note, added_at
```

**Mood values** (enum): `stillness`, `chaos`, `breakthrough`, `reflection`
**Ripeness values** (enum): `seed`, `sprout`, `ripe`, `published`
**Reaction types** (enum): `agree`, `challenge`
**Resource domains** (enum): `ai-ml`, `systems`, `philosophy`, `tools`, `books`
**Post status** (enum): `draft`, `published`
**Subscriber status** (enum): `active`, `unsubscribed`

---

## 11. ENVIRONMENT VARIABLES

These must exist in `.env.local` (never committed) and in Vercel dashboard.

```bash
# Sanity.io
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_READ_TOKEN=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=                           # PostgreSQL connection string

# Resend (newsletter)
RESEND_API_KEY=

# OpenAI (AI features — optional, Phase 3+)
OPENAI_API_KEY=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# GitHub PAT (admin editor write to repo — optional, Phase 3+)
GITHUB_PAT=

# ISR revalidation secret
REVALIDATE_SECRET=
```

**Never hardcode any of these values in code. Always use `process.env.VAR_NAME`.**

---

## 12. WHAT TO DO WHEN ASKED TO ADD A FEATURE

Follow this decision process in order:

```
1. Does this feature exist in the V1 scope? (See Section 1)
   YES → build it following all rules in this document
   NO  → ask Sumit: "This isn't in V1 scope. Should I add it to V2 or skip?"

2. Is this a public page or private lab page?
   PUBLIC  → SSG, no auth, fast, SEO-optimized
   PRIVATE → SSR, check auth in middleware AND page AND API route

3. Does this need a database?
   STATIC DATA (posts, projects) → Sanity.io Studio
   DYNAMIC DATA (diary, ideas, reactions, subscribers) → Supabase via Drizzle

4. Does this need an API route?
   YES → create /app/api/[name]/route.ts, add auth check, add Zod validation,
         add try/catch, return proper HTTP status codes
   NO  → Server Component data fetch is fine

5. Will this add a new npm package?
   Before installing: check if the functionality can be achieved without it.
   If yes, install it. If no, do not install it.
   Document the reason in a code comment.
```

---

## 13. WHAT NOT TO DO — EXPLICIT PROHIBITIONS

```
❌ Do not add Japanese characters to any UI element, label, or heading
❌ Do not create a /admin route (not in V1 — editor comes in Phase 3)
❌ Do not add user registration or multi-user auth
❌ Do not use Prisma (use Drizzle)
❌ Do not use Firebase or PlanetScale (use Supabase)
❌ Do not use Contentlayer or Velite (use Sanity)
❌ Do not use yarn or pnpm (use npm)
❌ Do not add Framer Motion unless explicitly asked
❌ Do not add features "while you're at it" without asking first
❌ Do not create files outside the folder structure in Section 4
❌ Do not import server-only modules ('use server', db.ts) in client components
❌ Do not add inline styles — use Tailwind classes + CSS custom properties
❌ Do not use Tailwind arbitrary values like bg-[#c41e3a] — use CSS variables
❌ Do not commit .env.local — verify .gitignore before every first push
❌ Do not return user data, session tokens, or secrets in API response bodies
❌ Do not write raw SQL strings — use Drizzle query builder
❌ Do not skip Zod validation on any user-submitted data
❌ Do not add more than one feature at a time without deploying and testing first
```

---

## 14. AGENT SELF-CHECK BEFORE SUBMITTING ANY CODE

Before presenting any code change, the agent must verify:

```
□ Does this follow the folder structure in Section 4?
□ Are all color values using CSS custom properties (not hardcoded hex)?
□ Is TypeScript strict mode satisfied? (no any, no ts-ignore)
□ If this is an API route — does it check auth before doing anything?
□ If this touches user input — is Zod validation in place?
□ If this is a 'use client' component — does it import nothing from lib/db.ts?
□ If this adds a new Sanity schema — does it match the types in Section 8 exactly?
□ If this adds a feature — is it within V1 scope or was it approved?
□ If this adds a new env variable — is it in .env.example (not .env.local)?
□ Are there no console.log() calls with sensitive data?
```

If any box is unchecked — fix it before submitting.

---

## 15. CURRENT BUILD STATUS

Update this section as phases complete.

```
Phase 1 — Foundation             [ ] NOT STARTED
Phase 2 — Public Content         [ ] NOT STARTED
Phase 3 — Database + Auth        [ ] NOT STARTED
Phase 4 — AI Features + Polish   [ ] NOT STARTED

Last updated: April 2025
Last deployed: —
Live URL: sumitkolgire.com (domain purchased, site not yet deployed)
```

---

## 16. QUICK REFERENCE — MOST COMMON TASKS

### Access Sanity Studio
Navigate to `http://localhost:3000/studio` to write and publish content.

### Add a new project
```bash
touch content/projects/project-name.mdx
# Same frontmatter, type: "project"
```

### Run development server
```bash
npm run dev
# Runs on http://localhost:3000
```

### Push DB schema changes
```bash
npx drizzle-kit push
# Never run drizzle-kit push on production DB without testing locally first
```

### Check build before deploy
```bash
npm run build
# Fix all TypeScript and build errors before pushing to main
```

---

*This document is the ground truth. Any AI agent, Cursor rule, Claude Project,
or GitHub Copilot working on this repo must read and follow it completely.*

*When in doubt — ask Sumit before building.*
