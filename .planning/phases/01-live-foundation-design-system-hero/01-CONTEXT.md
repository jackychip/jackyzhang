# Phase 1: Live Foundation — Design System + Hero - Context

**Gathered:** 2026-06-29
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase scaffolds the entire Next.js app **from zero** (greenfield — only `.planning/` and `CLAUDE.md` exist today) and delivers:

1. A **locked design-system foundation** — Tailwind v4 `@theme` single-source tokens (dark palette, violet→blue→cyan gradient, 8pt spacing scale, radius scale), self-hosted fonts (Clash Display via `next/font/local`; Inter + JetBrains Mono via `next/font/google`), `prefers-reduced-motion` safety, and visible keyboard focus states.
2. **Reusable, content-agnostic UI primitives** — Button, Card, Tech pill, Section, Timeline (shell only), Nav.
3. A **styled hero** composed from those primitives.
4. **Deployed live on GitHub Pages** via static export (`output: export`), basePath/assetPrefix `/jackyzhang`, with correct asset paths verified on the deployed URL.

**Binding design contract:** `01-UI-SPEC.md` (status: approved) makes the design direction numerically prescriptive. It locks all tokens, typography, color, component inventory, motion rules, and copywriting drafts. This discussion only resolves the open `[draft — owner to confirm]` items and a few first-phase implementation choices — it does **not** re-open anything the UI-SPEC locks.

**Not in scope:** Projects/About/Experience/Contact section content (Phases 2–3); the full scroll-reveal motion layer + Lighthouse/perf/SEO verification pass (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Hero Copy & Identity (resolves UI-SPEC `[draft — owner to confirm]` items)
- **D-01 — Headline (gradient LCP h1):** `Jacky Zhang`. The name is the h1; positioning is carried by the kicker + one-liner. (Confirms UI-SPEC draft.)
- **D-02 — Kicker (mono uppercase eyebrow):** Founder-forward identity, recommended string: **`Founder & Lead Engineer @ Revly · CompE @ UIUC`**. This overrides the UI-SPEC's plain `Computer Engineering @ UIUC` draft — owner chose to front-load the founder credibility signal. Exact wording is owner-tunable. **Planner/implementer must handle graceful wrapping at 360px** (14px JetBrains Mono uppercase + `0.08em` tracking is long; allow it to wrap to two lines cleanly or tighten the separator rather than overflow).
- **D-03 — Builder one-liner (sub-headline, Inter 16px / weight 600, solid near-white):** Confirms the UI-SPEC outcome-first draft verbatim: **`I build and ship real things — from a live automotive marketplace to robotics and games played 40,000+ times.`** Conveys the games → robotics → startups arc (HERO-02).

### Hero Composition
- **D-04 — Visual treatment:** **Pure typographic.** No portrait/headshot, no terminal/code motif. Hero = locked text stack + the single low-opacity (≤0.18) ambient radial gradient glow from the UI-SPEC. Chosen explicitly for LCP safety (no image to block first paint; text renders instantly at full opacity per HERO-03).
- **D-05 — Layout:** **Centered, single column** — kicker → name → one-liner → CTA row, vertically centered within `min-h-[100svh]`, horizontally centered. (`min-h-[100svh]` per UI-SPEC to avoid mobile URL-bar jump.)

### CTAs & First-Phase Assets
- **D-06 — Three CTAs ship this phase** per UI-SPEC: **View Work** (primary, gradient fill) · **Download Resume** (secondary, outline) · **Get in Touch** (tertiary, ghost).
- **D-07 — Resume PDF:** Owner **will provide a real `resume.pdf`** placed in `/public`. "Download Resume" links to a **basePath-aware `/resume.pdf`** and must work on the live deploy. (Action item: owner drops the file in before/at execution; do not ship a broken link.)
- **D-08 — Contact email:** `mailto:jackyz4@illinois.edu` (UIUC address — signals current student/intern candidate). Note this differs from the personal Gmail in the account profile; the `.edu` is the intentional choice.
- **D-09 — Nav + "View Work" before sections exist:** Use **in-page anchors to future sections** (`#work` / `#about` / `#contact`). Wire them once now; they resolve as Phases 2–3 land. In Phase 1 (hero-only page) they must degrade gracefully — smooth-scroll within the short page or no-op without error/jump. No `href="#"` placeholders, no dead-link console errors. Nav is composed from the Button + Tech-pill-type primitives per UI-SPEC (brand mark + anchor links + Resume CTA).

### Claude's Discretion
- GitHub Pages deploy **mechanism** (GitHub Actions workflow vs branch-based) — not discussed; implementer's choice, but it must produce a static export with basePath `/jackyzhang` and verify asset paths on the live URL.
- Skip-to-content link, scroll-cue affordance, and 404 page — UI-SPEC recommends a skip link; treat as standard a11y implementation detail.
- Exact kicker separator/punctuation and any minor copy polish within the locked intent of D-02.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract (read first — binding)
- `.planning/phases/01-live-foundation-design-system-hero/01-UI-SPEC.md` — **Approved, binding design contract.** Locks all design tokens (dark palette hex, gradient stops, 8pt spacing scale, radius scale), typography (4 sizes, weights 400/600, exact clamps + line-heights), color usage rules, component inventory + variants, the motion/interaction contract (never animate LCP h1; `MotionConfig reducedMotion="user"`; ambient glow rules), and copywriting. **Do not contradict it.** The decisions above only resolve its `[draft]` items.

### Requirements & scope
- `.planning/ROADMAP.md` §"Phase 1" — phase goal, 5 success criteria, mapped requirements.
- `.planning/REQUIREMENTS.md` — DSYS-01, DSYS-02, DSYS-03, DSYS-04, HERO-01, HERO-02, HERO-03, LNCH-05 (the 8 requirements this phase satisfies).

### Stack, fonts, deployment
- `CLAUDE.md` — locked tech stack + **exact versions** (Next 16.2.x, React 19.2.x, TS 6.0.x, Tailwind 4.3.x, `motion` 12.42.x, lucide-react, clsx + tailwind-merge), the load-bearing **Font Setup** detail (`next/font/local` for Clash Display, `@theme inline` to resolve font CSS vars), "What NOT to Use," and the GitHub Pages static-export deployment specifics. **Note:** CLAUDE.md's "Vercel Deployment" / "do not use `output: export`" guidance is **superseded** by the locked project decision to deploy GitHub Pages static export (see ROADMAP.md deployment note) — follow `output: export` + basePath `/jackyzhang`.
- `.planning/PROJECT.md` — owner facts (projects, metrics, identity), Key Decisions table, out-of-scope list.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **None — greenfield.** No `package.json`, `next.config.*`, `app/`, or `src/` exists yet. This phase creates the scaffold. No codebase maps in `.planning/codebase/`.

### Established Patterns
- Patterns are defined by the UI-SPEC, not by existing code: `cn()` (clsx + tailwind-merge) for class composition; single `@theme` token block in `globals.css`; primitives are content-agnostic; Motion components are client-only (`"use client"`).

### Integration Points
- The hero and nav are **composed from** the Phase-1 primitives (Button, Tech pill, Section), not bespoke — this is the integration contract for every later phase.
- Anchor IDs `#work` / `#about` / `#contact` (D-09) are the integration seam: Phase 2 attaches `#work`, Phase 3 attaches `#about` / `#contact`.

</code_context>

<specifics>
## Specific Ideas

- Hero is intentionally **typography-led** (founder/editorial), leaning on the gradient name + ambient glow rather than imagery — the gradient `Jacky Zhang` h1 is the visual centerpiece.
- Kicker should read as "I run a real product" before the reader even reaches the one-liner — hence leading with `Founder & Lead Engineer @ Revly`.
- The whole phase is a "ship something real early" slice: a live URL with a polished hero is the deliverable, with the design system underneath structurally preventing the 5 known pitfalls (LCP fade, gradient contrast, missing reduced-motion, FOUT, broken basePath paths).

</specifics>

<deferred>
## Deferred Ideas

- **Custom domain (e.g. `jackyzhang.dev`)** — CLAUDE.md notes a real domain reads better to recruiters than `*.github.io`. Owner skipped the "Deploy URL & basePath" discussion area, so Phase 1 ships on the **project page `jackychip.github.io/jackyzhang` with basePath `/jackyzhang`** (the UI-SPEC's locked assumption). A custom domain (which would remove the basePath) is a future enhancement, not this phase.
- **Switching to a user-site repo** (`jackychip.github.io`, served at root, no basePath) — considered implicitly; not chosen. Stay on the project-page + basePath model.

None of the above are blockers for Phase 1.

</deferred>

---

*Phase: 1-live-foundation-design-system-hero*
*Context gathered: 2026-06-29*
