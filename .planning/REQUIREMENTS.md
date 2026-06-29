# Requirements: Jacky Zhang — Personal Website

**Defined:** 2026-06-29
**Core Value:** A recruiter lands on the site and within seconds understands Jacky is a serious builder worth interviewing.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Design System (DSYS)

- [ ] **DSYS-01**: Site implements the locked design tokens (dark palette, violet→blue→cyan gradient, spacing/radius scale) as a single source of truth
- [ ] **DSYS-02**: Clash Display, Inter, and JetBrains Mono load self-hosted with no visible layout shift (no FOUT/FOIT)
- [ ] **DSYS-03**: Reusable UI primitives exist (Button, Card, Tech pill, Section, Timeline, Nav) consistent with the design system
- [ ] **DSYS-04**: Site honors `prefers-reduced-motion` and shows visible keyboard focus states throughout

### Hero (HERO)

- [ ] **HERO-01**: Visitor sees name, identity (Computer Engineering @ UIUC), and a builder one-liner within the first screen
- [ ] **HERO-02**: Hero conveys the builder arc (games → robotics → startups) with primary CTAs (view work, resume, contact)
- [ ] **HERO-03**: Hero renders its LCP heading immediately (no opacity-fade on the LCP element); decorative gradient drift is subtle and reduced-motion safe

### Projects (PROJ)

- [ ] **PROJ-01**: Visitor can view featured projects as metrics-forward cards (role, one-line outcome, tech stack, key metric)
- [ ] **PROJ-02**: Revly is featured with a working link to revly.ca
- [ ] **PROJ-03**: Roblox games are featured with play/CCU metrics and a live game link
- [ ] **PROJ-04**: Masongsong billing app, RoboCup, and SO-101 robotic arm are presented with role + outcome
- [ ] **PROJ-05**: Every external project link opens correctly (no placeholder or broken links)

### About (ABOUT)

- [ ] **ABOUT-01**: Visitor can read a short About narrative conveying the builder story and interests

### Resume & Experience (EXP)

- [ ] **EXP-01**: Visitor can view an experience timeline of roles (Revly, Masongsong, RoboCup, Roblox) with dates
- [ ] **EXP-02**: Visitor can download the current resume PDF from the site
- [ ] **EXP-03**: On-page timeline content matches the resume PDF (no mismatch)

### Contact (CONT)

- [ ] **CONT-01**: Visitor can email Jacky via a `mailto:` link
- [ ] **CONT-02**: Visitor can reach GitHub, LinkedIn, and other relevant links from the site

### Quality & Launch (LNCH)

- [ ] **LNCH-01**: Site is fully responsive and usable on mobile (verified at 360px width)
- [ ] **LNCH-02**: Mobile Lighthouse Performance ≥ 90 and LCP < 2.5s
- [ ] **LNCH-03**: Text meets WCAG AA contrast on the dark theme
- [ ] **LNCH-04**: Site has SEO metadata and a static Open Graph image so shared links render a rich preview
- [ ] **LNCH-05**: Site is deployed live on GitHub Pages with correct asset paths (basePath handled)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Depth (DEPTH)

- **DEPTH-01**: Per-project case-study detail pages
- **DEPTH-02**: Custom domain (e.g. jackyzhang.dev) replacing the GitHub Pages URL
- **DEPTH-03**: Light/dark theme toggle

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Blog / writing | Upkeep-heavy, no recruiting payoff for v1 |
| CMS / backend | Static content on GitHub Pages is sufficient |
| Auth / user accounts | No logged-in functionality needed |
| Contact form with backend | No server on GitHub Pages — use `mailto:` |
| Dynamic OG image (`next/og`) | Static export has no server runtime — use a static OG image |
| 3D/WebGL hero, preloaders | Fight the <3s load + mobile-majority audience |

## Traceability

Which phases cover which requirements. **Populated during roadmap creation.**

| Requirement | Phase | Status |
|-------------|-------|--------|
| (to be filled by roadmapper) | — | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: (pending roadmap)
- Unmapped: (pending roadmap)

---
*Requirements defined: 2026-06-29*
*Last updated: 2026-06-29 after initial definition*
