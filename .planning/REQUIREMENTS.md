# Requirements: Jacky Zhang — Personal Website

**Defined:** 2026-06-29
**Core Value:** A recruiter lands on the site and within seconds understands Jacky is a serious builder worth interviewing.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Design System (DSYS)

- [x] **DSYS-01**: Site implements the locked design tokens (dark palette, violet→blue→cyan gradient, spacing/radius scale) as a single source of truth
- [x] **DSYS-02**: Clash Display, Inter, and JetBrains Mono load self-hosted with no visible layout shift (no FOUT/FOIT)
- [x] **DSYS-03**: Reusable UI primitives exist (Button, Card, Tech pill, Section, Timeline, Nav) consistent with the design system — 01-03 shipped 5/6; 01-04 composed Nav from those primitives (brand + #work/#about/#contact anchors + Resume Button) → all 6 shipped, Complete
- [x] **DSYS-04**: Site honors `prefers-reduced-motion` and shows visible keyboard focus states throughout

### Hero (HERO)

- [ ] **HERO-01**: Visitor sees name, identity (Computer Engineering @ UIUC), and a builder one-liner within the first screen — built + prerendered in 01-04 (kicker "Founder & Lead Engineer @ Revly · CompE @ UIUC", name, one-liner on first screen); live-confirm pending owner deploy
- [ ] **HERO-02**: Hero conveys the builder arc (games → robotics → startups) with primary CTAs (view work, resume, contact) — built in 01-04 (3 CTAs: View Work / Download Resume / Get in Touch); live-confirm pending owner deploy
- [ ] **HERO-03**: Hero renders its LCP heading immediately (no opacity-fade on the LCP element); decorative gradient drift is subtle and reduced-motion safe — built in 01-04 (static gradient h1, no Motion in Hero.tsx, prerendered at full opacity in out/index.html; static ambient glow with globals.css reduced-motion guard); live-confirm pending owner deploy

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
- [ ] **LNCH-05**: Site is deployed live on GitHub Pages with correct asset paths (basePath handled) — code + static export complete (01-01 pipeline, 01-04 hero composed; withBasePath on resume.pdf); only satisfied by the deferred live-URL verification (owner deploy) — Partial

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
| DSYS-01 | Phase 1 | Complete (01-02) |
| DSYS-02 | Phase 1 | Complete (01-02) |
| DSYS-03 | Phase 1 | Complete (01-03 Button/Card/TechPill/Section/Timeline + 01-04 Nav — all 6 primitives) |
| DSYS-04 | Phase 1 | Complete (01-02 reduced-motion + 01-03 visible keyboard focus ring) |
| HERO-01 | Phase 1 | Built (01-04 — prerendered name + kicker + one-liner on first screen); live-confirm pending |
| HERO-02 | Phase 1 | Built (01-04 — builder one-liner + 3 CTAs); live-confirm pending |
| HERO-03 | Phase 1 | Built (01-04 — static gradient LCP h1, no Motion, full opacity in out/index.html); live-confirm pending |
| LNCH-05 | Phase 1 | Partial (code + static export complete; deferred live-URL verification) |
| PROJ-01 | Phase 2 | Pending |
| PROJ-02 | Phase 2 | Pending |
| PROJ-03 | Phase 2 | Pending |
| PROJ-04 | Phase 2 | Pending |
| PROJ-05 | Phase 2 | Pending |
| ABOUT-01 | Phase 3 | Pending |
| EXP-01 | Phase 3 | Pending |
| EXP-02 | Phase 3 | Pending |
| EXP-03 | Phase 3 | Pending |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 3 | Pending |
| LNCH-01 | Phase 4 | Pending |
| LNCH-02 | Phase 4 | Pending |
| LNCH-03 | Phase 4 | Pending |
| LNCH-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 23 total (source previously listed "22" — miscount; 23 distinct IDs are enumerated)
- Mapped to phases: 23 / 23 ✓
- Unmapped: 0

---
*Requirements defined: 2026-06-29*
*Last updated: 2026-06-29 after roadmap creation (traceability populated, count corrected to 23)*
