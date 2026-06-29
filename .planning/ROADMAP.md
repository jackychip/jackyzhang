# Roadmap: Jacky Zhang — Personal Website

## Overview

A recruiting-focused, statically-exported Next.js portfolio that signals "I ship real things" to recruiters and hiring managers within seconds. Built as vertical MVP slices: Phase 1 locks the entire design-system foundation (tokens, self-hosted fonts, reduced-motion safety, focus states, UI primitives) **and** ships a styled hero live on GitHub Pages — so something real is deployed early and the five critical pitfalls (LCP hero trap, gradient contrast, missing reduced-motion, FOUT, broken paths) are prevented before any section exists. Subsequent phases enrich the live site: the Projects proof payload, then the Story/Experience/Contact sections, then a final Motion + Performance + SEO + launch-quality pass. Everything is `output: export` static, deployed to GitHub Pages at `jackychip.github.io/jackyzhang` with `basePath` handling, a static Open Graph image (no `next/og`), and a `mailto:` contact (no backend).

**Deployment note:** Research SUMMARY.md suggested Vercel; the locked project decision is GitHub Pages static export. This roadmap follows the project decision — every phase assumes static export, `basePath`, unoptimized/pre-optimized images, static OG, and `mailto:`.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Live Foundation — Design System + Hero** - Locked design system + UI primitives + a styled hero, deployed live on GitHub Pages
- [ ] **Phase 2: Projects & Proof** - Metrics-forward project cards with working live links (Revly, Roblox, Masongsong, RoboCup, SO-101)
- [ ] **Phase 3: Story, Experience & Contact** - About narrative, experience timeline, downloadable resume, and outreach links
- [ ] **Phase 4: Motion, Performance & Launch** - A11y-safe motion layer, responsive/perf/contrast verification, SEO + static OG, final live launch

## Phase Details

### Phase 1: Live Foundation — Design System + Hero
**Goal**: A styled, on-brand hero is live on GitHub Pages, built atop a locked design system that structurally prevents the critical LCP, contrast, motion, and font pitfalls.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: DSYS-01, DSYS-02, DSYS-03, DSYS-04, HERO-01, HERO-02, HERO-03, LNCH-05
**Success Criteria** (what must be TRUE):
  1. Visiting the live GitHub Pages URL shows a hero with Jacky's name, "Computer Engineering @ UIUC," and a builder one-liner on the first screen, plus primary CTAs (view work, resume, contact). (HERO-01, HERO-02)
  2. The hero LCP headline renders immediately at full opacity (no opacity-fade on the LCP element); the violet→blue→cyan gradient is applied only to the large display heading, and any gradient drift is subtle and stops entirely under `prefers-reduced-motion`. (HERO-03, DSYS-04)
  3. Clash Display, Inter, and JetBrains Mono are self-hosted (`next/font/local` + `next/font`) and render with no visible font swap or layout shift (no FOUT/FOIT/CLS). (DSYS-02)
  4. All colors, the signature gradient, and the spacing/radius scale resolve from a single design-token source (Tailwind v4 `@theme`), and keyboard focus is visibly indicated everywhere. (DSYS-01, DSYS-04)
  5. Reusable UI primitives (Button, Card, Tech pill, Section, Timeline, Nav) exist as content-agnostic components, the hero/nav are composed from them, and all assets load with correct paths under the GitHub Pages `basePath`. (DSYS-03, LNCH-05)
**Plans**: TBD (est. 4)
**UI hint**: yes

### Phase 2: Projects & Proof
**Goal**: Recruiters can scan featured projects as metrics-forward cards with working live links — the site's core credibility payload.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05
**Success Criteria** (what must be TRUE):
  1. Visitor sees featured projects as metrics-forward cards, each showing role, a one-line outcome, the tech stack, and a key metric. (PROJ-01)
  2. Revly is featured with a working link to revly.ca that opens the live product. (PROJ-02)
  3. Roblox games are featured with play/CCU metrics (40k+ plays, 100+ peak CCU) and a working live game link. (PROJ-03)
  4. The Masongsong billing app, Team Canada RoboCup, and the SO-101 robotic arm each appear with role + concrete outcome. (PROJ-04)
  5. Every external project link opens the correct destination — no placeholder `href="#"` or broken links, verified on the deployed site. (PROJ-05)
**Plans**: TBD (est. 2)
**UI hint**: yes

### Phase 3: Story, Experience & Contact
**Goal**: Visitors can read the builder narrative, scan an accurate experience timeline, download the current resume, and reach out — completing the recruiter's decision path.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: ABOUT-01, EXP-01, EXP-02, EXP-03, CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. Visitor can read a short About narrative conveying the builder story (games → robotics → startups) and interests. (ABOUT-01)
  2. Visitor can view an experience timeline of roles (Revly, Masongsong, RoboCup, Roblox) with dates. (EXP-01)
  3. Visitor can download the current resume PDF directly from the site. (EXP-02)
  4. On-page timeline content matches the resume PDF with no factual mismatches (titles, dates, outcomes reconcile). (EXP-03)
  5. Visitor can email Jacky via a `mailto:` link and reach GitHub, LinkedIn, and other relevant links from the site. (CONT-01, CONT-02)
**Plans**: TBD (est. 3)
**UI hint**: yes

### Phase 4: Motion, Performance & Launch
**Goal**: The full live site is animated tastefully and accessibly, then verified fast, responsive, contrast-safe, and shareable — and re-confirmed in production on GitHub Pages.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: LNCH-01, LNCH-02, LNCH-03, LNCH-04
**Success Criteria** (what must be TRUE):
  1. Non-LCP sections reveal with a subtle scroll-driven motion layer (`motion` + `LazyMotion`) that fully disables under `prefers-reduced-motion`, while the hero LCP element still never animates. (motion enrichment; a11y backed by DSYS-04/HERO-03)
  2. The site is fully responsive and usable at 360px width — no horizontal scroll, no broken layout. (LNCH-01)
  3. Mobile Lighthouse Performance ≥ 90 and LCP < 2.5s on the deployed GitHub Pages site. (LNCH-02)
  4. All text meets WCAG AA contrast on the dark theme (gradient confined to large display headings; body stays solid near-white). (LNCH-03)
  5. Shared links render a rich preview from SEO metadata and a static Open Graph image (no `next/og`), verified live on the GitHub Pages URL. (LNCH-04)
**Plans**: TBD (est. 3)
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Live Foundation — Design System + Hero | 0/4 | Not started | - |
| 2. Projects & Proof | 0/2 | Not started | - |
| 3. Story, Experience & Contact | 0/3 | Not started | - |
| 4. Motion, Performance & Launch | 0/3 | Not started | - |
