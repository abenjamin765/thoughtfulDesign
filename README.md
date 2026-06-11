# Thoughtful Design

A static learning site for Object-Oriented UX, built with **Astro + MDX** and **Supabase** for auth and progress tracking. Deployed to **GitHub Pages**.

## Stack

- **Astro 6** — static site generation
- **MDX** — lesson content in `content/lessons/`
- **React islands** — quizzes, reflections, auth
- **Supabase** — public enrollment, progress, quiz responses
- **GitHub Actions** — deploy to GitHub Pages

## Quick start

```bash
cd ~/Sites/thoughtfulDesign
cp .env.example .env
# Add your Supabase URL + anon key
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor
3. Enable **Email** auth under Authentication → Providers
4. Copy project URL and anon key into `.env`:

```env
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Adding lessons

Create a new `.mdx` file in `content/lessons/`:

```mdx
---
title: "Lesson title"
module: "Module name"
order: 1
estimated_minutes: 15
published: true
quiz:
  - prompt: "Question?"
    options: ["A", "B", "C"]
    answer: 0
reflection:
  prompt: "What will you try on your project?"
---

## Lesson body

<Callout type="tip">Learning aid text</Callout>
```

Modules are grouped automatically from the `module` frontmatter field.

### MDX components

| Component | Usage |
| --- | --- |
| `<Callout type="tip\|warning\|truth">` | Highlighted learning aids |
| `<Reveal label="...">` | Collapsible answer |
| Quiz / Reflection | Defined in frontmatter; rendered below lesson body |

## GitHub Pages

Repository: [abenjamin765/thoughtfulDesign](https://github.com/abenjamin765/thoughtfulDesign)

Live site: `https://abenjamin765.github.io/thoughtfulDesign/`

1. Push this repo to GitHub
2. Enable **GitHub Pages** → Source: **GitHub Actions**
3. Add repository secrets:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`

To use a custom domain later, add a `public/CNAME` file and configure DNS in repo **Settings → Pages**.

## Scripts

| Command | Action |
| --- | --- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Build static site to `dist/` |
| `pnpm preview` | Preview production build |

## Project structure

```
content/lessons/     MDX lessons + frontmatter
src/components/      Quiz, auth, MDX helpers
src/pages/           Routes (landing, course, lessons)
supabase/migrations/ Database schema
```

## Design spec

See `docs/superpowers/specs/2026-06-11-thoughtful-design-lms-design.md`.
