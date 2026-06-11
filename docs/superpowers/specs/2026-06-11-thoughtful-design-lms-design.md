# Thoughtful Design LMS — Design Spec

**Date:** 2026-06-11  
**Status:** Approved

## Goal

Build a simple, public-enrollment LMS for Thoughtful Design — a course in Object-Oriented UX. Lessons are authored as MDX in git. Supabase handles auth and learner progress. The site deploys as a static app to GitHub Pages.

## Decisions

| Area | Choice |
| --- | --- |
| Enrollment | Public — anyone can sign up |
| Lesson format | MDX + quiz + reflection checkpoint |
| Course structure | Flexible — modules from frontmatter; outline TBD after research |
| Authoring | Markdown/MDX in repo; metadata in frontmatter |
| Hosting | GitHub Pages (`abenjamin765.github.io/thoughtfulDesign`) |
| Stack | Astro + MDX + React islands + Supabase |

## Architecture

- **Build time:** Astro compiles MDX lessons into static HTML
- **Runtime:** Supabase JS client in the browser for auth, quiz responses, lesson progress
- **Deploy:** GitHub Actions builds `dist/` and publishes via GitHub Pages

## Content model

Lessons live in `content/lessons/*.mdx` with frontmatter:

- `title`, `module`, `order`, `estimated_minutes`, `published`
- Optional `quiz[]` and `reflection`

Modules are derived at build time — no hardcoded course tree.

## Supabase schema

- `profiles` — extends auth users
- `lesson_progress` — reflection text + completion timestamp per lesson
- `quiz_responses` — per-question answers

RLS restricts all tables to `auth.uid()`.

## Pages

| Route | Auth | Purpose |
| --- | --- | --- |
| `/` | No | Landing |
| `/login`, `/signup` | No | Supabase email/password |
| `/course` | Yes | Module + lesson index |
| `/lessons/[slug]` | Yes | Lesson reader + exercises |
| `/dashboard` | Yes | Progress overview |

## MDX components (v1)

- `Callout` — tip, warning, Ancient Truth
- `Reveal` — collapsible answers
- `Quiz` — multiple choice (frontmatter-driven)
- `ReflectionPrompt` — saved open response
- `LessonComplete` — manual completion marker

## Deferred

- Final course outline from object-oriented design research
- Video embeds
- Admin CMS
- Payments
- Certificates
- OAuth providers

## Deployment

- `astro.config.mjs` → `site: https://abenjamin765.github.io`, `base: /thoughtfulDesign/`
- GitHub Actions workflow with Supabase env secrets
- Optional custom domain via `public/CNAME` later
