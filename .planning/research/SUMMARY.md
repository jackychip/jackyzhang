# Research Summary — Jacky Zhang Personal Website

**Synthesized:** 2026-06-29
**Confidence:** HIGH
**Source dimensions:** STACK.md · FEATURES.md · ARCHITECTURE.md · PITFALLS.md

## Executive Summary

Jacky Zhang's portfolio is a statically-rendered, recruiting-conversion site with one measurable goal: a recruiter or hiring manager lands on the page and within 5–15 seconds decides to reach out. The owner's raw material — 30k+ Roblox plays, founding developer at a stealth fintech startup, Team Canada RoboCup, EV parking case study — is a top-5% engineering-student story. The site's job is to make that range legible fast, not to be a design showcase.

The recommended approach is a fully static Next.js 16 App Router site (RSC by default, client JS only at nav and motion wrappers), with content stored as typed TypeScript arrays that sections map over. Tailwind v4's CSS-first `@theme` block owns every design token. `motion` (formerly framer-motion) provides scroll-reveal animations, loaded with `LazyMotion` to minimize client bundle weight. Vercel provides zero-config deployment. The committed stack is correct — no changes recommended.

The key risks are execution habits, not architectural choices. The top five pitfalls — animating the hero headline from `opacity: 0` (direct LCP regression on mobile), gradient text failing WCAG contrast on dark backgrounds, missing `prefers-reduced-motion` support (content goes permanently invisible), over-design burying the signal recruiters need, and Clash Display FOUT from naive font loading — are all cheap to prevent from day one and expensive to retrofit. Wire `MotionConfig reducedMotion="user"` and accessible color tokens in Phase 1; never animate the LCP element.

## Stack (validated — no changes)

- **Next.js `16.x` App Router**, **React `19.x`**, **TypeScript `6.x`**, **Tailwind CSS `4.x`**, **`motion` `12.x`** (formerly `framer-motion` — install `motion`, import from `motion/react`, client-only).
- **Tailwind v4 is CSS-first**: design tokens (dark palette, fonts, violet→blue→cyan gradient) live in a `@theme` / `@theme inline` block in `globals.css` — `@theme inline` is required to wire `next/font` CSS variables or font utilities silently break.
- **Fonts:** Clash Display is a Fontshare/ITF font (NOT Google) → download variable `.woff2`, self-host via `next/font/local`. Inter + JetBrains Mono via `next/font/google` (self-hosted at build). Zero runtime third-party font requests. Do NOT use a Fontshare CDN `@import`/`<link>` (render-blocking, FOUT, CLS).
- **Deploy:** Vercel zero-config. Avoid `output: export` so `next/image` and `next/og` work.

## Features (recruiter-conversion lens)

- **Table stakes:** <3s load, mobile-first (60–68% of recruiter traffic is mobile), zero broken links, downloadable + current resume PDF, clear positioning, working contact, LinkedIn link.
- **Differentiators (the edge):** range-with-proof — games + fintech founding dev + Team Canada RoboCup + EV study. Lead with the builder *arc*, not a list. Metrics-forward project cards ("30k+ plays · 100+ concurrent"). Live game links = unfakeable shipping proof.
- **Anti-features:** contact form with backend (use `mailto:`), 3D/WebGL hero, preloaders, filler tutorial projects, blog (out of scope).

## Architecture

- **Load-bearing boundary:** `components/ui/` (content-agnostic primitives — Button, Card, Pill, Section, Timeline, Nav) vs `components/sections/` (content-aware regions). Build primitives first.
- **Content = typed "CMS":** plain TS arrays in `content/*.ts` (`projects.ts`, `experience.ts`, `socials.ts`, `site.ts`) with interfaces in `types/`. No MDX/CMS.
- **Tokens in one place:** Tailwind v4 `@theme` block in `globals.css` (single source of truth, CSS vars + utilities).
- **RSC by default;** client boundary only at leaves (nav, motion wrappers).
- **Motion quarantined + a11y-gated:** `motion/react`, `useReducedMotion()` for JS animations, `@media (prefers-reduced-motion)` for the CSS hero gradient drift.

## Pitfalls (prevent from day one)

1. **Hero LCP trap** — never animate the headline from `opacity:0`; render the LCP element at full opacity, animate only secondary elements/CSS.
2. **Gradient contrast** — violet `#7C3AED` + low-opacity text fail WCAG; reserve gradient for large display headings only, body stays solid near-white.
3. **Reduced-motion + focus** — set `MotionConfig reducedMotion="user"`; never strip focus rings on the dark theme.
4. **Clash Display FOUT/CLS** — self-host via `next/font/local` with size-adjusted fallback.
5. **Content + links** — role + metric + stack per project card; current resume PDF; no placeholder `href="#"`; OG image so shared links don't render blank; watch Vercel's case-sensitive Linux builds.
6. **Live-URL verification is non-optional** — many failures (resume, links, OG, mobile, case-sensitive assets) only surface in production.

## Roadmap Implications — suggested 5 phases

1. **Foundation & Design System** — scaffold, `next/font/local` (Clash Display) + Google fonts, `@theme` accessible tokens + gradient, `MotionConfig reducedMotion="user"` at root, `ui/` primitives on a preview page, focus-visible styling. *Locks all critical pitfalls before sections exist.*
2. **Content Model** — `types/content.ts` + populate `content/*.ts` with real metrics/roles/stack/live links; drop `public/` resume PDF. *Needs owner input: shareable fintech metrics, RoboCup framing.*
3. **Sections (static, no animation)** — Hero → Projects → About → Resume → Contact as RSC, composing primitives over content. Mobile-first (tested 360px), blink test on real hierarchy.
4. **Motion & animation layer** — wrap non-LCP elements; hero gradient drift as CSS keyframe; `LazyMotion` + `domAnimation`; verify mobile Lighthouse Perf ≥ 90, LCP < 2.5s.
5. **SEO, OG, polish & launch** — `metadata`, `opengraph-image.tsx`, `sitemap.ts`/`robots.ts`, Vercel prod + custom domain, pre-launch checklist (link check, Lighthouse mobile, contrast audit, keyboard nav, OG preview).

## Open Questions (owner input, not research)

- Shareable fintech metrics under the startup's stealth status (affects that card's headline).
- Custom domain (e.g. `jackyzhang.dev`) — affects SEO canonical + share URL.
- Resume PDF currency — confirm the latest PDF to ship.
- Hero builder-arc copy + About narrative — owner-drafted before sections are built.

---
*Synthesized from 4 research dimensions, 2026-06-29.*
