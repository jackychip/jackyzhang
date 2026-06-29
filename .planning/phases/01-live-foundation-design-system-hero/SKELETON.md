# Walking Skeleton — Jacky Zhang Personal Website

**Phase:** 1
**Generated:** 2026-06-29

## Capability Proven End-to-End

> A recruiter can visit `https://jackychip.github.io/jackyzhang/` and load a statically-exported Next.js page — on-brand fonts and tokens, a gradient hero, working CTAs — served correctly under the `/jackyzhang` basePath with all `_next/` assets and `public/` files resolving (no 404s).

This is a **fully static, single-tier** stack. There is no API, database, or server runtime — every "dynamic" concern (OG generation, image optimization, contact form) is replaced with a static equivalent by design. The skeleton therefore proves: `next build` (`output: export`) → GitHub Actions artifact deploy → GitHub Pages → basePath-correct live URL.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.2.x App Router + React 19.2.x + TypeScript 6.0.x (`strict: true`) | Locked stack (CLAUDE.md); RSC default is the modern recruiting-signal baseline. `create-next-app` pins the matched core set. |
| Styling / tokens | Tailwind CSS v4.3.x, CSS-first — single `@theme inline` block in `globals.css` | DSYS-01 single source of truth; `inline` keyword required to resolve `next/font` CSS vars. No `tailwind.config.js`. |
| Fonts | Clash Display via `next/font/local`; Inter + JetBrains Mono via `next/font/google` | DSYS-02 self-hosted, zero third-party request, `display:swap`, no FOUT/FOIT/CLS. |
| Animation | `motion` 12.42.x (`motion/react`), client-only, wrapped in `<MotionConfig reducedMotion="user">` | One animation library only; global reduced-motion gate (DSYS-04). Never the LCP h1 (HERO-03). |
| Data layer | **None (static site)** | No DB/API tier; portfolio content is static markup. |
| Auth | **None** | All content public; no sessions/cookies/input (ASVS L1, most categories N/A). |
| Deployment target | GitHub Pages **static export** (`output: 'export'`, `images.unoptimized: true`), basePath/assetPrefix `/jackyzhang`, GitHub Actions artifact deploy | Locked project decision (supersedes CLAUDE.md's Vercel guidance). Actions artifact deploy serves `_next/` untouched (no Jekyll strip). |
| basePath strategy | Single `NEXT_PUBLIC_BASE_PATH` env var drives `next.config` + runtime `withBasePath()` helper | One source of truth; prod=`/jackyzhang`, local dev=`""`. Plain `<a>`/`<img>` to `public/` need the helper (framework components auto-prefix). |
| Directory layout | `src/` layout: `src/app/` (routes), `src/components/ui/` (primitives), `src/components/` (Nav/Hero), `src/lib/` (cn, base-path); `public/fonts/`, `public/resume.pdf`; `.github/workflows/deploy.yml` | Matches RESEARCH "Recommended Project Structure". |

## Stack Touched in Phase 1

- [x] Project scaffold (Next 16 App Router, TS strict, Tailwind v4, ESLint, Prettier + tailwind plugin)
- [x] Routing — one real route (`/` index page; optional `not-found`)
- [ ] Database — **N/A** (static site, no read/write tier)
- [x] UI — interactive elements wired (3 hero CTAs, Nav anchors) styled from the design system
- [x] Deployment — live on GitHub Pages via GitHub Actions, verified on the `/jackyzhang` URL

## Out of Scope (Deferred to Later Slices)

> Explicit minimalism list — prevents later phases from re-litigating Phase 1's scope.

- Projects / About / Experience / Contact **section content** (Phases 2–3) — only the design system, primitives, and hero ship now.
- Full scroll-reveal motion layer (`LazyMotion`) and Lighthouse/perf/SEO/contrast verification pass (Phase 4).
- Static Open Graph image + SEO metadata richness (Phase 4) — a placeholder `og.png` may exist but is not verified now.
- Custom domain (`jackyzhang.dev`) and the user-site repo model — deferred (DEPTH-02); stays on project page + basePath `/jackyzhang`.
- `next/og`, `next/image` optimization, any backend/contact form — permanently out of scope for v1 (static export, `mailto:` contact).

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- **Phase 2 — Projects & Proof:** attach `#work`; metrics-forward project `Card`s with working external links (Revly, Roblox, Masongsong, RoboCup, SO-101).
- **Phase 3 — Story, Experience & Contact:** attach `#about`/`#contact`; About narrative, populate the `Timeline` shell (EXP-01), resume download, outreach links.
- **Phase 4 — Motion, Performance & Launch:** scroll-reveal layer (`LazyMotion`), responsive/perf/contrast verification, SEO + static OG, final live re-confirmation.
