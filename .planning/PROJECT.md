# Jacky Zhang — Personal Website

## What This Is

A personal website for Jacky Zhang — a Computer Engineering student at UIUC (B.S. expected May 2029) and a multi-domain builder: founder & lead engineer of Revly (a live automotive-services marketplace), freelance full-stack developer, robotics programmer (Team Canada RoboCup + an ML-driven robotic arm), and a Roblox game developer with 40k+ plays. The site is a recruiting-focused portfolio that signals "I ship real things" to tech recruiters and engineering hiring managers, led by a bold, founder-energy visual identity.

## Core Value

A recruiter or hiring manager lands on the site and within seconds understands that Jacky is a serious builder worth interviewing — backed by concrete, verifiable projects and credibility signals.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Bold, modern hero that communicates identity and the builder arc (games → robotics → startups/SWE)
- [ ] Projects section showcasing featured work (Revly, Masongsong billing app, RoboCup, SO-101 arm, Roblox games) with metrics and live links
- [ ] About / story section conveying the builder narrative
- [ ] Resume / experience timeline with downloadable resume PDF
- [ ] Contact / links (email, GitHub, LinkedIn) for easy outreach
- [ ] Responsive, fast, accessible (WCAG-aware on the dark theme), deployed live on GitHub Pages

### Out of Scope

- Blog / writing section — not wanted for v1, ongoing upkeep with no recruiting payoff
- CMS / backend — static content is sufficient; deploying static to GitHub Pages
- Authentication / user accounts — no logged-in functionality needed
- Contact form with backend — use a `mailto:` link instead (no server on GitHub Pages)
- Dynamic OG image generation (`next/og`) — use a static Open Graph image (static export has no server runtime)

## Context

- **Owner:** Jacky Zhang, B.S. Computer Engineering @ University of Illinois Urbana-Champaign (expected May 2029). GitHub: jackychip. Email: jackyz4@illinois.edu.
- **Flagship project — Revly (revly.ca):** Founder & Lead Engineer (Nov 2025–present). A Canadian mobile marketplace connecting vehicle owners with local automotive service providers (detailing, roadside, tire) across Ontario. Architected full-stack from scratch: Flutter/Dart app, FastAPI backend, Supabase (DB/auth/realtime), Stripe payments, FCM push. **Public — can be named and linked.**
- **Masongsong Engineering (freelance SWE, May 2026–present):** Built a full-stack timesheet + progress-billing app replacing a legacy MS Access system — 12 feature phases across 2 milestones; a progress-billing invoice engine with four cost-type calculations, carry-over, cross-job aggregation, and a create→finalize→PDF→correct lifecycle that reconciles to the dollar. Stack: Next.js 14, TypeScript, Supabase (Postgres + Auth + Storage + RLS), Prisma, Tailwind/shadcn, react-pdf, Vitest/Playwright, Vercel.
- **Team Canada RoboCup (Lead Programmer, July 2025):** 1 of 8 students nationwide; autonomous IR-based ball detection & pursuit; optimized loop logic/sensor polling for ~40% faster execution and ~30% less memory.
- **SO-101 Robotic Arm (2025–present):** Assembled a 6-DOF arm (hardware bring-up, WSL2, teleop); trained an ACT (Action Chunking with Transformers) imitation-learning model via the LeRobot framework on dual RTX 3080 GPUs.
- **Roblox Game Development (Sep 2022–present):** Shipped multiple Lua games, 40k+ total plays, 100+ peak CCU; co-managed a 200+ player competitive community.
- **Relevant skills:** Python, Java, C/C++, Next.js/TypeScript, React Native, Flutter/Dart, FastAPI, Supabase/Firebase, Lua, Git. Already comfortable with Next.js — building this site in it is itself a recruiting signal.
- **Audience:** Primarily tech recruiters and engineering hiring managers scanning for signal.

## Constraints

- **Tech stack**: Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + `motion` (formerly Framer Motion). Modern industry-standard stack that doubles as a recruiting signal and overlaps with known skills.
- **Deployment**: GitHub Pages — **static export** (`output: export`). No server runtime → static OG image, `mailto:` contact, unoptimized/pre-optimized images, and `basePath` handling if served from a project page (`jackychip.github.io/jackyzhang`) rather than a user-site repo.
- **Design direction**: Bold & modern "founder" aesthetic, dark-first — locked design system (see Key Decisions). Accessibility-aware: gradient reserved for large display headings only; body text stays solid near-white.
- **Scope**: v1 is a focused, static, recruiting-oriented portfolio. No blog, CMS, or backend.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Recruiting-focused personal site, audience = recruiters/hiring managers | Primary goal is landing internships; everything optimizes for fast credibility | — Pending |
| Bold & modern "founder" visual direction (dark-first) | Matches builder/founder identity; high first-impression impact | — Pending |
| Signature gradient: violet → blue → cyan (`#7C3AED → #2563EB → #06B6D4`), large display headings only | Techy, energetic, recruiter-safe; restricting to display text avoids WCAG contrast fails | — Pending |
| Typography: Clash Display (headings, self-hosted via `next/font/local`) / Inter (body) / JetBrains Mono (labels) | Dramatic editorial display + clean legible body + dev-coded mono; Clash is a Fontshare font, not Google | — Pending |
| Stack: Next.js + TS + Tailwind v4 + `motion`; static export | Modern standard; building in it is a recruiting signal; export needed for GitHub Pages | — Pending |
| Deploy to GitHub Pages (static export) | Owner's choice; free, GitHub-native; trades away Vercel's image/OG server features (handled with static alternatives) | — Pending |
| Revly named and linked (public); other founder work shown with role + outcomes | Revly is a real public product (revly.ca) — strongest founder signal | — Pending |
| Sections: Hero, Projects, About, Resume/experience, Contact (no blog) | Covers recruiter needs without upkeep-heavy extras | — Pending |
| Never animate the LCP hero headline; `MotionConfig reducedMotion="user"` | Prevents the #1 mobile-LCP perf trap and a permanent-invisible-content a11y bug | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-29 after initialization (corrected resume + GitHub Pages deploy)*
