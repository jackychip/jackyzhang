# Phase 1: Live Foundation — Design System + Hero - Pattern Map

**Mapped:** 2026-06-29
**Files analyzed:** 18 new files (greenfield scaffold)
**Analogs found:** 0 sibling-file analogs / 18 — **clean slate.** Every "analog" is an authoritative convention source (CLAUDE.md / RESEARCH.md / UI-SPEC), not an existing sibling file.

## Greenfield Notice

> **There are NO existing code patterns to mirror.** The repo currently contains only `CLAUDE.md`, `.planning/`, `.gitattributes`, `.git` — no `package.json`, no `next.config.*`, no `app/`/`src/`. A codebase search (`Glob`/`Grep` for `*.ts`/`*.tsx`/`controllers`/`components`) would return nothing. Phase 1 creates the scaffold itself.

Because there are no sibling files, the "closest analog" for each new file is its **authoritative convention source**:

| Source | Authority over | Role here |
|--------|----------------|-----------|
| `01-RESEARCH.md` Patterns 1–5 + Code Examples | exact config/wiring snippets (next.config, base-path, fonts, `@theme inline`, cn, deploy yml, Button skeleton) | **Primary copy-from** — has literal code |
| `01-UI-SPEC.md` | tokens (hex/spacing/radius), typography, primitive inventory + variants, motion/focus rules, copy | **Primary contract** — values to encode |
| `CLAUDE.md` Font Setup / What NOT to Use / Stack | package list, font strategy, banned approaches | **Guardrails** |
| `01-CONTEXT.md` D-01..D-09 | hero copy, CTAs, anchors, email, basePath model | **Content** |

Where these disagree, see [Authority Conflicts](#authority-conflicts) — project decision + RESEARCH win.

## File Classification

| New File | Role | Data Flow | Closest Analog (source) | Match Quality |
|----------|------|-----------|-------------------------|---------------|
| `package.json` | config | — | RESEARCH Standard Stack + Installation block | exact (versions enumerated) |
| `next.config.ts` | config | — | RESEARCH Pattern 1 | exact (literal snippet) |
| `tsconfig.json` | config | — | `create-next-app` default + CLAUDE `strict:true` | scaffold-default |
| `.github/workflows/deploy.yml` | config/CI | batch | RESEARCH "GitHub Actions deploy workflow" | exact (literal yml) |
| `src/lib/cn.ts` | utility | transform | RESEARCH "`cn()` utility" | exact (literal snippet) |
| `src/lib/base-path.ts` | utility | transform | RESEARCH Pattern 1 (`withBasePath`) | exact (literal snippet) |
| `src/app/globals.css` | config/tokens | — | RESEARCH Pattern 2 `@theme inline` + UI-SPEC tokens | exact (literal block + hex) |
| `src/app/layout.tsx` | provider/root | request-response | RESEARCH Pattern 2 (fonts) + Pattern 5 (`MotionConfig`) | exact (literal snippet) |
| `src/app/page.tsx` | route | request-response | RESEARCH structure + UI-SPEC composition | role-match (compose-only) |
| `src/app/not-found.tsx` | route | request-response | CONTEXT discretion (optional a11y) | role-match |
| `public/fonts/ClashDisplay-Semibold.woff2` | asset | file-I/O | CLAUDE Font Setup (owner-provided, A3/OQ-2) | owner action |
| `public/resume.pdf` | asset | file-I/O | CONTEXT D-07 (owner-provided) | owner action |
| `src/components/ui/Button.tsx` | component | event-driven | RESEARCH "Button primitive skeleton" + UI-SPEC | exact (literal skeleton) |
| `src/components/ui/Card.tsx` | component | — | UI-SPEC Component Inventory (Card row) | spec-only (no code) |
| `src/components/ui/TechPill.tsx` | component | — | UI-SPEC Component Inventory (Tech pill row) | spec-only |
| `src/components/ui/Section.tsx` | component | — | UI-SPEC Component Inventory (Section row) | spec-only |
| `src/components/ui/Timeline.tsx` | component | — | UI-SPEC Component Inventory (Timeline row) | spec-only (shell) |
| `src/components/Nav.tsx` | component | event-driven | UI-SPEC Nav row + CONTEXT D-09 | spec-only |
| `src/components/Hero.tsx` (+ `HeroIntro.tsx`) | component | event-driven | RESEARCH Patterns 3/4 + UI-SPEC motion table | exact (literal h1 + split) |

## Pattern Assignments

### `next.config.ts` (config) — single basePath source of truth

**Source:** RESEARCH Pattern 1. Copy verbatim:
```ts
import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },     // mandatory: no edge optimizer on Pages
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};
export default nextConfig;
```
- `NEXT_PUBLIC_BASE_PATH=/jackyzhang` is set **only in the CI build step**, unset locally (dev serves at `/`).
- `images.unoptimized: true` is non-negotiable — the export build errors without it (Pitfall 2).
- `trailingSlash: true` is RESEARCH's recommendation (A2); planner may flip to `false` — low risk.

---

### `src/lib/cn.ts` (utility) — class composition

**Source:** RESEARCH Code Examples. Copy verbatim:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```
Every primitive imports `cn` from `@/lib/cn`. No string concatenation for classes anywhere.

---

### `src/lib/base-path.ts` (utility) — the gotcha fix

**Source:** RESEARCH Pattern 1. Copy verbatim:
```ts
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBasePath = (p: string) => `${basePath}${p}`;
```
**Apply to every plain `<a href>`/`<img src>` pointing at `public/`** — `resume.pdf` (D-07), static OG later. `next/link`/`next/image`/`next/font` are basePath-aware automatically; do NOT double-prefix those.

---

### `src/app/globals.css` (config/tokens) — `@theme inline` block (DSYS-01)

**Source:** RESEARCH Pattern 2 + UI-SPEC Color/Spacing/Radius tables. The `inline` keyword is **required** to resolve `next/font` vars (Pitfall 4). Token values come from UI-SPEC (authoritative):
```css
@import "tailwindcss";
@theme inline {
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);

  --color-bg:        #0A0A0F;   /* dominant 60% */
  --color-surface:   #14141F;   /* secondary 30% */
  --color-border:    #262633;   /* hairline */
  --color-text:      #EDEDF2;   /* primary text */
  --color-text-muted:#A1A1B5;   /* muted */
  --color-violet:    #7C3AED;   /* gradient stop 1 */
  --color-blue:      #3B82F6;   /* gradient stop 2 / focus ring */
  --color-cyan:      #22D3EE;   /* gradient stop 3 */

  --radius-sm: 6px;  --radius-md: 10px;  --radius-lg: 16px;  --radius-pill: 9999px;
}
@media (prefers-reduced-motion: reduce) {
  .ambient-glow { animation: none; }   /* CSS-keyframe glow guard (Pattern 5) */
}
```
Spacing: use Tailwind v4's default 4px-base scale (xs4 / sm8 / md16 / lg24 / xl32 / 2xl48 / 3xl64 per UI-SPEC) — no extra token declarations needed unless the planner wants named aliases.

---

### `src/app/layout.tsx` (root provider) — fonts + MotionConfig

**Source:** RESEARCH Pattern 2 (fonts) + Pattern 5 (reduced motion). Copy structure:
```tsx
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";

const clashDisplay = localFont({
  src: [{ path: "../../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" }],
  variable: "--font-display", display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
```
- Apply `${clashDisplay.variable} ${inter.variable} ${mono.variable}` on `<html>`.
- Wrap children in `<MotionConfig reducedMotion="user">` (import from `motion/react`) — this file or a thin client wrapper must be marked appropriately since `MotionConfig` is client-only; prefer a small `"use client"` providers component imported into the RSC layout.
- Load **weight 600 only** this phase (UI-SPEC typography note; Bold 700 reserved).
- Confirm the `.woff2` exists in `public/fonts/` before wiring (OQ-2 / A3) — owner action.

---

### `src/components/ui/Button.tsx` (component) — variant primitive (DSYS-03/04)

**Source:** RESEARCH "Button primitive skeleton" + UI-SPEC Button row. Copy skeleton:
```tsx
import { cn } from "@/lib/cn";
type Variant = "primary" | "secondary" | "ghost";
const variants: Record<Variant, string> = {
  primary:   "bg-gradient-to-r from-violet via-blue to-cyan text-white",
  secondary: "border border-border text-text hover:bg-surface",
  ghost:     "text-text hover:bg-surface",
};
// base: "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4
//        font-sans text-base font-semibold transition-colors duration-150
//        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
```
- `min-h-11` (44px) = the 44×44 hit-area rule.
- `focus-visible:outline-blue` (2px / 2px offset, `#3B82F6`) = the DSYS-04 focus ring — applies to ALL interactive primitives.
- Add `asChild`/`as` prop so CTAs render as `<a>`: **Download Resume** uses `withBasePath("/resume.pdf")` + `download`; **Get in Touch** uses `mailto:jackyz4@illinois.edu` (D-08); **View Work** is an anchor to `#work`.
- `size`: `md` (default) + `sm` per UI-SPEC. Optional leading/trailing `lucide-react` icon (install at `^1`, NOT `^0.5xx`).

---

### `src/components/Hero.tsx` + `HeroIntro.tsx` — LCP-safe split (HERO-03)

**Source:** RESEARCH Patterns 3 + 4 + UI-SPEC motion table + CONTEXT D-01..D-05.

`Hero.tsx` (Server Component, no `"use client"`) — the **static gradient h1 is the LCP element, never wrapped in Motion**:
```tsx
<h1 className="bg-gradient-to-r from-violet via-blue to-cyan bg-clip-text text-transparent
               font-display font-semibold tracking-[-0.02em] leading-[1.05]
               text-[clamp(2.75rem,6vw,4.5rem)]">
  Jacky Zhang
</h1>
```
`HeroIntro.tsx` (`"use client"`, `motion/react`) — kicker + sub-headline + CTA row, subtle entrance only (fade + translate ≤ 8px, ≤ 400ms, slight stagger):
- Kicker (D-02): `Founder & Lead Engineer @ Revly · CompE @ UIUC` — JetBrains Mono 14px/400 uppercase, tracking `0.08em`. **Must wrap cleanly at 360px** (Pitfall 6 / LNCH-01) — do NOT `whitespace-nowrap`; allow 2-line wrap or tighten the `·` separator on mobile.
- Sub-headline (D-03): `I build and ship real things — from a live automotive marketplace to robotics and games played 40,000+ times.` — Inter 16px **weight 600**, solid `#EDEDF2` (NEVER gradient — Anti-Pattern).
- CTA row: the 3 Buttons (D-06).
- Layout (D-05): centered single column inside `<section className="grid min-h-[100svh] place-items-center">`.

**Hard rule:** never `<motion.h1 initial={{opacity:0}}>` — that is the exact LCP-fade trap (HERO-03 / Pitfall 3). `text-transparent` makes the name invisible if it fades from 0.

---

### `src/components/Nav.tsx` — composed from primitives (DSYS-03)

**Source:** UI-SPEC Nav row + CONTEXT D-09. Sticky/fixed bar on `#14141F`/translucent surface; brand mark + anchor links (`#work`/`#about`/`#contact`) + Resume CTA (reuse `Button`). Active link uses accent indicator. Anchors must degrade gracefully on the hero-only page (smooth-scroll or no-op, **no `href="#"` placeholders, no console errors**). External links (future) get `rel="noopener noreferrer"` — establish that convention now.

---

### `Card` / `TechPill` / `Section` / `Timeline` (components) — spec-only, no code analog

These have **no literal snippet** in any source — build from UI-SPEC Component Inventory rows + the token contract. Content-agnostic shells (project/timeline content lands Phases 2–3). All import `cn`, style against `@theme` tokens, RSC by default (no `"use client"` unless interactive):
- **Card:** bg `surface`, `rounded-[16px]` (radius-lg), hairline `border-border`, padding `lg` (24px).
- **TechPill:** Mono 14px/400 uppercase, `rounded-full` (radius-pill), bg `surface`, hairline border, padding `sm`/`md`.
- **Section:** max-width container (`max-w-5xl`/`6xl`), responsive vertical padding (`xl` mobile → `3xl` desktop).
- **Timeline:** vertical list scaffold (dot + line + slot), no data — shell only.

---

### `.github/workflows/deploy.yml` (CI) — GitHub Pages artifact deploy (LNCH-05)

**Source:** RESEARCH "GitHub Actions deploy workflow". Copy verbatim (configure-pages → upload-pages-artifact(`./out`) → deploy-pages). Build step sets `env: NEXT_PUBLIC_BASE_PATH: /jackyzhang`. Use the **Actions artifact deploy** (not branch-based) so `_next/` is served untouched — Jekyll strips underscore dirs (Pitfall 5). If ever falling back to a branch deploy, add an empty `.nojekyll`.
- One-time owner action (web UI, no `gh` CLI): Repo Settings → Pages → Source = "GitHub Actions".
- **LNCH-05 is only satisfied by verifying on the LIVE `/jackyzhang` URL** (fonts load, `resume.pdf` resolves, no 404s) — not locally.

## Shared Patterns

### Reduced motion (DSYS-04)
**Source:** RESEARCH Pattern 5. **Apply to:** all Motion + the CSS glow.
`<MotionConfig reducedMotion="user">` in layout disables every Motion animation globally; the `@media (prefers-reduced-motion: reduce){ .ambient-glow{animation:none} }` guard covers the CSS-keyframe glow. Do not hand-roll per-component `useReducedMotion`.

### Keyboard focus ring (DSYS-04)
**Source:** UI-SPEC Motion & Interaction + Button skeleton. **Apply to:** every interactive element (Button, Nav links, CTAs).
`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue` (`#3B82F6`, 2px, 2px offset). Never strip `outline` without an equivalent. Tab order follows visual order; skip-to-content link recommended.

### basePath asset references (LNCH-05)
**Source:** RESEARCH Pattern 1 / Pitfall 1. **Apply to:** every `public/` asset in a plain `<a>`/`<img>`.
Route through `withBasePath()`. Framework components (`next/link`/`next/image`/`next/font`/`next/script`) auto-prefix — do not double-wrap.

### Gradient discipline (DSYS-04 / HERO-03 / LNCH-03)
**Source:** UI-SPEC Color "Accent reserved for" list. **Apply to:** all text + surfaces.
Gradient `bg-clip-text text-transparent` is allowed on the hero h1 ONLY (and as a solid fill on the primary "View Work" button bg). Body text, sub-headline, and section headings stay solid `#EDEDF2`. The lightest stop (`#22D3EE`) must clear 3:1 large-text AA on `#0A0A0F` — keep gradient text ≥ ~32px.

### Client/Server boundary
**Source:** CLAUDE.md + RESEARCH Anti-Patterns. **Apply to:** all components.
RSC by default. Only files using Motion or interactivity get `"use client"` (or import `motion/react-client`). Importing Motion in a Server Component throws. Package is `motion` (import `motion/react`) — NEVER `framer-motion`.

## No Analog Found

Every file is greenfield; "no sibling analog" applies universally. The files below additionally have **no literal code snippet** in any source (build purely from UI-SPEC contract rows — planner should NOT expect a copy-from excerpt):

| File | Role | Why no code analog |
|------|------|--------------------|
| `src/components/ui/Card.tsx` | component | UI-SPEC describes props/tokens only |
| `src/components/ui/TechPill.tsx` | component | UI-SPEC describes props/tokens only |
| `src/components/ui/Section.tsx` | component | UI-SPEC describes props/tokens only |
| `src/components/ui/Timeline.tsx` | component | Content-agnostic shell; populated Phase 3 |
| `src/components/Nav.tsx` | component | Composition described, not coded |
| `src/app/not-found.tsx` | route | Optional a11y nicety (CONTEXT discretion) |

## Authority Conflicts

Where sources disagree, **project decision + RESEARCH win** (resolved in RESEARCH §"Project Constraints" DIVERGENCE and CONTEXT canonical_refs):

| Conflict | CLAUDE.md says | Winning authority | Use |
|----------|----------------|-------------------|-----|
| Deploy / output mode | Vercel runtime; `output: export` "not recommended"; keep `next/image` + `next/og` | Locked project decision (ROADMAP/PROJECT/CONTEXT/UI-SPEC) | **GitHub Pages static export** — `output: "export"`, `images.unoptimized: true`, basePath `/jackyzhang`, static OG, `mailto:` contact. `next/og` + image optimization OFF. |
| `lucide-react` version | `^0.5xx` | RESEARCH (npm registry 2026-06-29) | **`^1` (1.22.0)** — CLAUDE.md is stale |
| `next export` invocation | (implies CLI era patterns) | RESEARCH State of the Art | `output: 'export'` in `next.config.ts` — the `next export` CLI was removed in Next 14 |
| Contact email | account profile = `jackychipersonal@gmail.com` | CONTEXT D-08 | **`mailto:jackyz4@illinois.edu`** (intentional `.edu` recruiter signal) |

No other conflicts. CLAUDE.md remains authoritative for everything else (exact core versions, font strategy, "What NOT to Use" bans, App Router, single animation lib, `cn()`).

## Build Sequencing (from RESEARCH walking-skeleton)

Planner should respect these hard dependencies:
1. Scaffold + `next.config.ts` + `cn.ts` + `base-path.ts` (config first — nothing renders correctly otherwise)
2. Fonts + tokens (`layout.tsx` `next/font` + `globals.css` `@theme inline`) — primitives style against these
3. Primitives (Button, Card, TechPill, Section, Timeline shell, Nav) — hero composes from these
4. Hero + Nav composition (static h1 + MotionConfig + client entrance + 3 CTAs + anchors)
5. Deploy (Actions workflow) + verify on LIVE `/jackyzhang` URL

> Deploy plumbing may be stood up early (near-empty page) to de-risk basePath verification, then the hero filled in — but tokens/fonts MUST precede primitives, and primitives MUST precede hero.

## Owner Action Items (block live verification)

- `public/resume.pdf` must exist before the live-URL check (D-07 / OQ-1) — gate with a `checkpoint:human-verify`.
- `public/fonts/ClashDisplay-Semibold.woff2` (weight 600) must be downloaded from Fontshare (ITF Free License) before wiring `localFont` (A3 / OQ-2).
- Repo Settings → Pages → Source = "GitHub Actions" (one-time web UI toggle).

## Metadata

**Analog search scope:** entire repo — confirmed greenfield (only `.planning/`, `CLAUDE.md`, `.gitattributes`, `.git`)
**Files scanned:** 0 source files exist (nothing to scan)
**Authoritative sources read:** `CLAUDE.md`, `01-RESEARCH.md`, `01-UI-SPEC.md`, `01-CONTEXT.md`
**Pattern extraction date:** 2026-06-29
