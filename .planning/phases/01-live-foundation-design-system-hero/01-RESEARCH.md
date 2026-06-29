# Phase 1: Live Foundation — Design System + Hero - Research

**Researched:** 2026-06-29
**Domain:** Next.js 16 App Router static export → GitHub Pages; Tailwind v4 CSS-first design tokens; self-hosted `next/font`; Motion-based hero with LCP/a11y safety
**Confidence:** HIGH

## Summary

This phase scaffolds a greenfield Next.js 16 (App Router) + React 19 + TypeScript 6 + Tailwind v4 app, locks a CSS-first design-token system, self-hosts three fonts with zero layout shift, builds six content-agnostic UI primitives, composes a typographic hero, and ships it **statically exported** to GitHub Pages at `jackychip.github.io/jackyzhang` (basePath `/jackyzhang`). The entire phase is structurally about preventing five known pitfalls before any content exists: (1) the LCP-fade trap, (2) gradient-on-body contrast fails, (3) missing reduced-motion handling, (4) FOUT/FOIT/CLS from fonts, and (5) broken asset paths under basePath.

The static-export + GitHub Pages path is well-trodden and officially supported by Next.js (`output: 'export'`), but it has two load-bearing gotchas that the planner must task explicitly: **`images.unoptimized: true`** is mandatory (the edge optimizer requires a server that GitHub Pages doesn't provide), and **plain `<a href="/...">` links to `public/` assets do NOT get the basePath prepended automatically** — only `next/link`, `next/image`, `next/font`, and `next/script` are basePath-aware. The resume PDF download (D-07) and any static OG asset are the concrete victims of this gotcha and must use a basePath-prefix helper.

**Primary recommendation:** Scaffold with `create-next-app` (App Router + TS + Tailwind + ESLint), set `output: 'export'` + `images.unoptimized: true` + `basePath`/`assetPrefix` from a single `NEXT_PUBLIC_BASE_PATH` source, wire all three fonts through `next/font` into a single Tailwind v4 `@theme inline` block, render the hero `<h1>` as static gradient text with **no Motion wrapper at all**, gate every other animation behind `<MotionConfig reducedMotion="user">`, and deploy via a GitHub Actions workflow (`configure-pages` → `upload-pages-artifact` → `deploy-pages`). Build the design tokens and fonts FIRST, primitives SECOND, hero THIRD, deploy LAST.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Design tokens (palette, gradient, spacing, radius) | Build (CSS `@theme`) | — | Tailwind v4 compiles tokens to static CSS at build; no runtime |
| Font loading & self-hosting | Build (`next/font`) | Browser (font swap) | `next/font` downloads + self-hosts at build, emits `<link rel=preload>` and CSS vars; browser applies with `display:swap` |
| Hero h1 (LCP) | Static HTML (SSG prerender) | — | Server Component prerendered to HTML at build; renders instantly, no JS gate |
| Hero entrance / glow animation | Browser (Client Component) | — | Motion is client-only (`"use client"`); decorative, non-blocking |
| UI primitives (Button, Card, etc.) | Static HTML | Browser (hover/focus via CSS) | Server Components by default; only interactive/animated ones need `"use client"` |
| Routing / anchors (`#work` etc.) | Browser | — | In-page hash navigation; no server |
| Asset serving (fonts, resume.pdf, OG) | CDN / Static (GitHub Pages) | — | All static files served from `/jackyzhang/...` path |
| Image rendering | Static HTML (`unoptimized`) | — | No optimizer; images served as-is from `public/` |

**Note:** This is a fully static, single-tier deployment. There is no API/backend/server tier — every "dynamic" feature (OG generation, image optimization, contact form) is explicitly out of scope and replaced with a static equivalent.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `16.2.9` | App Router, build, static export, `next/font` | Current major; App Router + RSC is the modern baseline `[VERIFIED: npm registry]` |
| `react` / `react-dom` | `19.2.7` | UI library | Matched peer set for Next 16 `[VERIFIED: npm registry]` |
| `typescript` | `6.0.3` | Type safety, recruiter signal | Current; supported by Next 16; use `strict:true` `[VERIFIED: npm registry]` |
| `tailwindcss` | `4.3.2` | CSS-first utility styling + `@theme` tokens | v4 CSS-first fits the small locked token system `[VERIFIED: npm registry]` |
| `@tailwindcss/postcss` | `4.3.2` | Tailwind v4 PostCSS plugin | v4 build path; wired by `create-next-app --tailwind` `[VERIFIED: npm registry]` |
| `motion` | `12.42.0` | Hero entrance + ambient glow + `MotionConfig` | The single animation dep; import from `motion/react` `[VERIFIED: npm registry]` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lucide-react` | `1.22.0` | Icons (GitHub, mail, arrow, external-link) | Always; tree-shakeable. **NOTE: now on 1.x — CLAUDE.md's `^0.5xx` is stale** `[VERIFIED: npm registry]` |
| `clsx` | `2.1.1` | Conditional class composition | Inside `cn()` util `[VERIFIED: npm registry]` |
| `tailwind-merge` | `3.6.0` | Conflict-safe Tailwind class merge | Inside `cn()` util `[VERIFIED: npm registry]` |
| `next/font` (built-in) | n/a | Self-hosted fonts, zero CLS | Always — `local` for Clash Display, `google` for Inter + JetBrains Mono `[CITED: nextjs.org/docs]` |

### Dev Tooling
| Library | Version | Purpose |
|---------|---------|---------|
| `eslint` + `eslint-config-next` | `10.6.0` | Linting (flat config) `[VERIFIED: npm registry]` |
| `prettier` | `3.9.3` | Formatting `[VERIFIED: npm registry]` |
| `prettier-plugin-tailwindcss` | `0.8.0` | Canonical Tailwind class sorting `[VERIFIED: npm registry]` |

### Alternatives Considered (rejected per CLAUDE.md "What NOT to Use")
| Instead of | Could Use | Tradeoff — why rejected |
|------------|-----------|--------------------------|
| `next/font/local` for Clash Display | Fontshare CDN `@import` | Render-blocking, FOUT, third-party IP leak — never in prod |
| `motion` | GSAP / react-spring / AOS / CSS-only | Stacking animation libs kills the "fast site" pitch; one lib only |
| Raw Tailwind primitives | MUI / Chakra / Ant | Heavy kits fight the custom dark system, read as "template" |
| `output: 'export'` static OG image | `next/og` `ImageResponse` | No server runtime on GitHub Pages — must be a static PNG |
| `images.unoptimized` | custom image loader (Cloudinary) | Out of scope; no external image service for a portfolio |

**Installation:**
```bash
npx create-next-app@latest jackyzhang --app --typescript --tailwind --eslint --src-dir --import-alias "@/*"
npm install motion lucide-react clsx tailwind-merge
npm install -D prettier prettier-plugin-tailwindcss
```
> `create-next-app` pins `next`/`react`/`react-dom`/`tailwindcss`/`@tailwindcss/postcss`/`typescript`/`eslint` as a matched set — do not hand-pin them. `--src-dir` is optional (a `src/` layout is recommended for cleanliness); adjust import alias paths accordingly.

**Version verification:** All versions above confirmed via `npm view <pkg> version` on 2026-06-29 against the npm registry.

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `next` | npm | ~9 yrs | ~8M/wk | github.com/vercel/next.js | OK | Approved |
| `react` / `react-dom` | npm | ~12 yrs | ~30M/wk | github.com/facebook/react | OK | Approved |
| `typescript` | npm | ~10 yrs | ~70M/wk | github.com/microsoft/TypeScript | OK | Approved |
| `tailwindcss` / `@tailwindcss/postcss` | npm | ~7 yrs | ~15M/wk | github.com/tailwindlabs/tailwindcss | OK | Approved |
| `motion` | npm | ~7 yrs (as framer-motion) | ~6M/wk | github.com/motiondivision/motion | OK | Approved |
| `lucide-react` | npm | ~3 yrs | ~3M/wk | github.com/lucide-icons/lucide | OK | Approved (1.x — see note) |
| `clsx` | npm | ~7 yrs | ~40M/wk | github.com/lukeed/clsx | OK | Approved |
| `tailwind-merge` | npm | ~4 yrs | ~12M/wk | github.com/dcastil/tailwind-merge | OK | Approved |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

All packages are canonical, top-tier, and previously vetted in CLAUDE.md's stack research. `lucide-react@1.22.0` (latest, published 2026-06-28) is a legitimate major-version progression from the `0.x` line CLAUDE.md referenced; the planner should install `lucide-react` at `^1` (latest), not pin `^0.5xx`. Download-count figures are order-of-magnitude estimates `[ASSUMED]`; verdicts are HIGH-confidence based on registry age, maintained source repos, and ubiquity.

## Architecture Patterns

### System Architecture Diagram

```
                          BUILD TIME (next build, output: export)
  ┌──────────────────────────────────────────────────────────────────────┐
  │  app/layout.tsx (RSC)                                                  │
  │    ├─ next/font/local(ClashDisplay) ─┐                                 │
  │    ├─ next/font/google(Inter)        ├─► self-host .woff2 to           │
  │    └─ next/font/google(JetBrainsMono)┘   _next/static/media/ + CSS vars│
  │                                                                        │
  │  globals.css  ──►  @theme inline { --color-*, --font-*, --radius-* }   │
  │                     (Tailwind v4 compiles to static utility CSS)       │
  │                                                                        │
  │  app/page.tsx (RSC) ──► <Hero>                                         │
  │     <h1 gradient>  ◄── STATIC, no Motion, prerendered to HTML (LCP)    │
  │     <Kicker/Sub/CTAs> ◄── "use client" Motion entrance (non-blocking)  │
  │     composed from primitives: Button · TechPill · Section · Nav        │
  └───────────────────────────────┬──────────────────────────────────────┘
                                   │  emits  /out  (HTML/CSS/JS + assets)
                                   ▼
                       .github/workflows/deploy.yml
        actions/configure-pages → upload-pages-artifact(out) → deploy-pages
                                   │
                                   ▼
                 GitHub Pages  https://jackychip.github.io/jackyzhang/
                   ├─ /jackyzhang/_next/static/...  (basePath-aware: auto)
                   ├─ /jackyzhang/resume.pdf        (MANUAL basePath prefix!)
                   └─ /jackyzhang/og.png            (MANUAL basePath prefix!)

  RUNTIME (browser): hero h1 already painted ► hydrate ► Motion entrance
       ► prefers-reduced-motion? ► MotionConfig disables all animation
```

Trace the primary path: a recruiter requests `/jackyzhang/` → GitHub Pages serves prebuilt `index.html` with the gradient `<h1>` already in the markup and the font preloaded → LCP fires on first paint → JS hydrates → kicker/sub/CTAs run their subtle entrance (or skip it entirely under reduced-motion).

### Recommended Project Structure
```
jackyzhang/
├── .github/workflows/deploy.yml   # GitHub Pages CI deploy
├── public/
│   ├── fonts/                      # ClashDisplay-*.woff2 (self-hosted local)
│   ├── resume.pdf                  # owner-provided (D-07)
│   └── og.png                      # static OG (Phase 4; placeholder ok now)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # fonts + <MotionConfig> + metadata
│   │   ├── page.tsx                # composes <Nav> + <Hero>
│   │   ├── globals.css             # @theme inline token block
│   │   └── not-found.tsx           # 404 (a11y nicety, optional)
│   ├── components/
│   │   ├── ui/                     # Button, Card, TechPill, Section, Timeline
│   │   ├── Nav.tsx
│   │   └── Hero.tsx                # "use client" only for animated parts
│   └── lib/
│       ├── cn.ts                   # clsx + tailwind-merge
│       └── base-path.ts            # withBasePath() helper (the gotcha fix)
├── next.config.ts
└── package.json
```

### Pattern 1: Single basePath source of truth
**What:** Drive `basePath`, `assetPrefix`, AND the runtime asset helper from one env var so prod (`/jackyzhang`) and local dev (empty) stay in sync.
**When to use:** Always, for every `public/` asset referenced by a plain `<a>`/`<img>`.
**Example:**
```ts
// next.config.ts — Source: nextjs.org/docs/app/guides/static-exports + GitHub community #191018
import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },     // mandatory: no edge optimizer on Pages
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,               // emit /me/index.html — friendlier on Pages
};
export default nextConfig;
```
```ts
// src/lib/base-path.ts — prepend basePath to public/ assets (plain <a>/<img> are NOT auto-prefixed)
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBasePath = (p: string) => `${basePath}${p}`;
// usage: <a href={withBasePath("/resume.pdf")} download>Download Resume</a>
```
Set `NEXT_PUBLIC_BASE_PATH=/jackyzhang` in the GitHub Actions build step (and leave unset locally so `npm run dev` serves at `/`).

### Pattern 2: Three fonts → one `@theme inline` block (zero CLS)
**What:** Load fonts via `next/font` (self-hosting both local and Google at build), expose them as CSS variables, then resolve those variables inside Tailwind v4's `@theme inline`.
**When to use:** Always — this is the DSYS-02 contract.
**Example:**
```tsx
// src/app/layout.tsx — Source: Tailwind discussion #15267 + owolf next15+tailwind4 guide
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";

const clashDisplay = localFont({
  src: [{ path: "../../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" }],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```
```css
/* src/app/globals.css — the `inline` keyword is REQUIRED to resolve next/font vars */
@import "tailwindcss";
@theme inline {
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);

  --color-bg:        #0A0A0F;
  --color-surface:   #14141F;
  --color-border:    #262633;
  --color-text:      #EDEDF2;
  --color-text-muted:#A1A1B5;
  --color-violet:    #7C3AED;
  --color-blue:      #3B82F6;
  --color-cyan:      #22D3EE;

  --radius-sm: 6px;  --radius-md: 10px;  --radius-lg: 16px;  --radius-pill: 9999px;
}
```
> Without `inline`, Tailwind emits `font-family: var(--font-display)` into a context where the next/font variable isn't resolved at that scope, breaking the wiring. `[CITED: github.com/tailwindlabs/tailwindcss/discussions/15267]`

### Pattern 3: Gradient-clip text — display headings ONLY
**What:** Apply the violet→blue→cyan gradient as a clipped text fill, never to body copy.
**Example:**
```tsx
// Hero h1 — the ONE gradient element. Static. No Motion wrapper.
<h1 className="bg-gradient-to-r from-violet via-blue to-cyan bg-clip-text text-transparent
               font-display font-semibold tracking-[-0.02em] leading-[1.05]
               text-[clamp(2.75rem,6vw,4.5rem)]">
  Jacky Zhang
</h1>
```
> Pitfall: `text-transparent` makes the text invisible if the gradient fails to paint — keep this confined to large display text (≥ ~32px) so the lightest stop still clears the 3:1 large-text AA threshold, and never use it for the sub-headline.

### Pattern 4: LCP-safe hero — split static h1 from animated siblings
**What:** The h1 is a plain Server-Component element (no `"use client"`, no Motion). Only the kicker/sub/CTA group is a Client Component with a Motion entrance.
**Example:**
```tsx
// Hero.tsx
import { HeroIntro } from "./HeroIntro"; // "use client" — animates kicker/sub/CTAs
export function Hero() {
  return (
    <section className="grid min-h-[100svh] place-items-center">
      <div className="text-center">
        <h1 /* static gradient, see Pattern 3 — renders at full opacity immediately */>Jacky Zhang</h1>
        <HeroIntro /> {/* kicker + sub-headline + CTA row, Motion-animated, non-blocking */}
      </div>
    </section>
  );
}
```
> Never wrap the h1 in `<motion.h1 initial={{opacity:0}}>` — that is the exact LCP-fade pitfall HERO-03 forbids.

### Pattern 5: Global reduced-motion gate
```tsx
// layout.tsx body — every Motion animation auto-disables under prefers-reduced-motion
import { MotionConfig } from "motion/react";
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```
```css
/* globals.css — belt-and-suspenders for the CSS-keyframe ambient glow (not driven by Motion) */
@media (prefers-reduced-motion: reduce) {
  .ambient-glow { animation: none; }
}
```

### Anti-Patterns to Avoid
- **Wrapping the LCP h1 in Motion / opacity-fade:** directly violates HERO-03.
- **Gradient on body text or the sub-headline:** contrast fail + invisible-text risk (DSYS-04/LNCH-03). Sub-headline is solid `#EDEDF2` at weight 600.
- **Hardcoding `/resume.pdf` in a plain `<a>`:** 404s under basePath — use `withBasePath()`.
- **`@theme` without `inline` for font vars:** fonts silently fall back.
- **Importing Motion in a Server Component:** Motion is client-only; mark the file `"use client"` or import `motion/react-client`.
- **`framer-motion` package name:** deprecated alias — use `motion`, import `motion/react`.
- **Relying on `next/image` optimization:** disabled under `output:'export'`; you MUST set `images.unoptimized:true` or the build errors.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting + preload + fallback metrics | Manual `@font-face` + preload tags | `next/font` (`local` + `google`) | Auto size-adjust fallback eliminates CLS; auto preload; build-time self-host (no third-party request) |
| Conditional/merged Tailwind classes | String concatenation | `cn()` = `clsx` + `tailwind-merge` | Resolves conflicting utilities (`p-2 p-4`) deterministically |
| Reduced-motion disabling per-animation | Per-component `useReducedMotion` checks everywhere | `<MotionConfig reducedMotion="user">` | One wrapper disables all Motion animations globally |
| Icons | Hand-drawn SVGs | `lucide-react` | Tree-shakeable, consistent stroke set |
| basePath on routed links/scripts/images | Manual string prefixing everywhere | `next/link`, `next/image`, `next/script` | These are basePath-aware automatically (only plain `<a>`/`<img>` to `public/` need the helper) |
| GitHub Pages deploy plumbing | Custom rsync/branch scripts | `actions/configure-pages` + `upload-pages-artifact` + `deploy-pages` | First-party, handles artifact + Pages env + `.nojekyll`-free `_next` serving |

**Key insight:** In a static-export Next app, almost every "tricky" concern (fonts, basePath, deploy) already has a first-party mechanism — the only thing you genuinely hand-roll is the `withBasePath()` helper for non-framework `public/` asset references.

## Common Pitfalls

### Pitfall 1: Plain `<a href="/resume.pdf">` 404s on GitHub Pages
**What goes wrong:** The Download Resume link (and any `public/` asset in a plain anchor/img) resolves to `jackychip.github.io/resume.pdf` instead of `.../jackyzhang/resume.pdf`.
**Why it happens:** `basePath` only auto-applies to `next/link`, `next/image`, `next/font`, `next/script` — NOT to raw HTML attributes.
**How to avoid:** Route every `public/` asset reference through `withBasePath()` (Pattern 1).
**Warning signs:** Link works on `localhost` (no basePath) but 404s on the live URL — test the deployed URL, not just dev.

### Pitfall 2: Build fails / images break under static export
**What goes wrong:** `next build` errors with "Image Optimization using the default loader is not compatible with `output: export`."
**Why it happens:** The default `next/image` loader needs a running server.
**How to avoid:** Set `images: { unoptimized: true }`, pre-size/compress source assets, always pass explicit `width`/`height` (reserves space, no CLS).
**Warning signs:** Build-time error mentioning `loader`; or images load in dev but the export build fails.

### Pitfall 3: Invisible hero h1 (gradient + transparent text)
**What goes wrong:** `bg-clip-text text-transparent` leaves the name invisible if the gradient layer doesn't paint or if applied to small text.
**Why it happens:** The text color is literally transparent; it depends entirely on the background gradient rendering.
**How to avoid:** Confine to large display text; verify the lightest stop (`#22D3EE`) clears 3:1 large-text AA on `#0A0A0F`; never animate this element's opacity (a fade from 0 = temporarily invisible LCP).
**Warning signs:** Name flickers/absent on slow paint; Lighthouse flags LCP element as low-contrast.

### Pitfall 4: `@theme` font variables don't resolve
**What goes wrong:** Fonts fall back to system sans despite `next/font` loading correctly.
**Why it happens:** Tailwind v4 needs `@theme inline` (not plain `@theme`) to resolve runtime-injected CSS variables from `next/font`.
**How to avoid:** Use `@theme inline { --font-display: var(--font-display); ... }` and apply the font `.variable` classNames on `<html>`.
**Warning signs:** Headings render in Arial/system font; `--font-display` shows unresolved in devtools.

### Pitfall 5: `_next/` assets 404 on branch-based Pages deploy
**What goes wrong:** Stylesheets/JS under `_next/` are stripped by Jekyll on GitHub Pages.
**Why it happens:** Jekyll ignores underscore-prefixed directories.
**How to avoid:** Prefer the **GitHub Actions artifact deploy** (`upload-pages-artifact` + `deploy-pages`) which serves the artifact directly with NO Jekyll processing — `_next/` works untouched. If you ever fall back to a `gh-pages` branch deploy, you MUST add an empty `.nojekyll` file at the publish root.
**Warning signs:** HTML loads but unstyled; `_next/static/...` requests 404.

### Pitfall 6: Kicker overflow at 360px (D-02)
**What goes wrong:** `Founder & Lead Engineer @ Revly · CompE @ UIUC` in 14px JetBrains Mono uppercase + `0.08em` tracking overflows a 360px viewport.
**Why it happens:** Mono + tracking + uppercase is wide; the string is long.
**How to avoid:** Allow clean two-line wrap (don't `whitespace-nowrap`), or tighten the `·` separator spacing on mobile. Test at 360px.
**Warning signs:** Horizontal scroll or clipped kicker on narrow screens (LNCH-01).

## Code Examples

### `cn()` utility
```ts
// src/lib/cn.ts — Source: tailwind-merge + clsx standard pattern
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

### GitHub Actions deploy workflow
```yaml
# .github/workflows/deploy.yml — Source: GitHub community #191018, actions/deploy-pages
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - uses: actions/configure-pages@v5
      - run: npm ci
      - run: npm run build
        env: { NEXT_PUBLIC_BASE_PATH: /jackyzhang }
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./out }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
> Repo Settings → Pages → Source must be set to **"GitHub Actions"** (one-time manual step; no `gh` CLI required).

### Button primitive (gradient/outline/ghost) skeleton
```tsx
// src/components/ui/Button.tsx — Source: standard cva-free variant pattern + UI-SPEC
import { cn } from "@/lib/cn";
type Variant = "primary" | "secondary" | "ghost";
const variants: Record<Variant, string> = {
  primary:   "bg-gradient-to-r from-violet via-blue to-cyan text-white",
  secondary: "border border-border text-text hover:bg-surface",
  ghost:     "text-text hover:bg-surface",
};
export function Button({ variant = "primary", className, ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 font-sans text-base font-semibold",
        "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
        variants[variant], className,
      )}
      {...props}
    />
  );
}
```
> `min-h-11` (44px) satisfies the 44×44 hit-area rule; `focus-visible:outline-blue` is the 2px/2px-offset `#3B82F6` focus ring (DSYS-04). For link-rendered CTAs (Resume/Contact), render an `<a>` with the same classes (an `asChild`/`as` prop) so `withBasePath()`/`mailto:` work.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next export` CLI | `output: 'export'` in config | Next 13.3→14 (removed in 14) | Use config, not the removed CLI |
| `framer-motion` | `motion` package, `motion/react` | 2024 rebrand | Install `motion`; same API |
| Tailwind `tailwind.config.js` | v4 CSS-first `@theme` in CSS | Tailwind v4 (2025) | No JS config; tokens live in `globals.css` |
| `lucide-react@0.x` | `lucide-react@1.x` (1.22.0) | 2026 | Install `^1`, not `^0.5xx` (CLAUDE.md stale) |
| Branch-based `gh-pages` + `.nojekyll` | Actions artifact deploy (`deploy-pages@v4`) | 2023+ | No Jekyll step; `_next/` served untouched |

**Deprecated/outdated:**
- `next export` CLI — removed in Next 14; use `output: 'export'`.
- `framer-motion` import path — replaced by `motion/react`.
- Pages Router — use App Router (`app/`).

## Project Constraints (from CLAUDE.md)

Actionable directives extracted from CLAUDE.md (treated as locked):
- **Stack & versions:** Next 16.2.x, React 19.2.x, TS 6.0.x (floor 5.7), Tailwind 4.3.x + `@tailwindcss/postcss`, `motion` 12.42.x (import `motion/react`), `lucide-react`, `clsx` + `tailwind-merge`. `strict: true`.
- **App Router only** (no Pages Router). RSC by default; mark animated/interactive components `"use client"`.
- **Fonts:** Clash Display via `next/font/local` (self-hosted `.woff2`); Inter + JetBrains Mono via `next/font/google`; wire through `@theme inline`. No Fontshare CDN. Load only the display weights actually used (600 this phase).
- **One animation library only** (`motion`). No GSAP/AOS/react-spring/Lottie stacking.
- **No heavy component kits** (MUI/Chakra/Ant), no runtime CSS-in-JS, no state libraries.
- **No `framer-motion`** (deprecated alias).
- **`cn()`** for all conditional class composition.
- **GSD workflow:** all file edits go through a GSD command (already in effect).
- **DIVERGENCE (explicitly resolved):** CLAUDE.md's "Recommended Stack/Vercel/do-not-use-`output:export`" guidance is **superseded** by the locked project decision — deploy GitHub Pages static export with `output:'export'` + basePath `/jackyzhang`. This is confirmed in ROADMAP.md, PROJECT.md Key Decisions, STATE.md, and 01-CONTEXT.md/01-UI-SPEC.md. `next/og` and `next/image` optimization are OFF; use static OG + `images.unoptimized`.

## Runtime State Inventory

Not applicable — this is a greenfield scaffold (no rename/refactor/migration). No existing datastores, services, OS registrations, secrets, or build artifacts exist. (Verified: repo contains only `.planning/`, `CLAUDE.md`, `.gitattributes`, `.git` — no `package.json`/`src`/`app`.)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next 16 build (needs ≥ 20.9) | ✓ | 20.18.1 | — |
| npm | Install/build | ✓ | 10.8.2 | — |
| git | Version control / push to trigger CI | ✓ | 2.50.1 | — |
| GitHub Actions runner | CI build + Pages deploy | ✓ (cloud) | n/a | branch-based `gh-pages` + `.nojekyll` |
| `gh` CLI | (optional) configure Pages source | ✗ | — | Set Source→"GitHub Actions" via repo Settings web UI |
| GitHub Pages enabled | Live deploy (LNCH-05) | manual | n/a | Owner enables Pages + sets Source to "GitHub Actions" |

**Missing dependencies with no fallback:** none blocking — Node/npm/git all present; the GitHub Actions runner and Pages hosting are cloud-side.
**Missing dependencies with fallback:** `gh` CLI absent — the one-time "Settings → Pages → Source: GitHub Actions" toggle is done in the web UI (an owner action, not a code task). Owner must also drop `public/resume.pdf` before the live link is verified (D-07).

## Security Domain

ASVS Level 1. This is a fully static, no-input, no-auth, no-data site — most ASVS categories are structurally N/A. The real surface is outbound links and the static hosting headers.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth/login anywhere |
| V3 Session Management | no | No sessions/cookies |
| V4 Access Control | no | All content public |
| V5 Input Validation | no | No user input/forms (contact is `mailto:`) |
| V6 Cryptography | no | No secrets; HTTPS provided by GitHub Pages |
| V7 Error Handling/Logging | minimal | Static 404 page; no server logs |
| V14 Configuration | yes | Security headers limited on Pages; outbound-link hygiene |

### Known Threat Patterns for static GitHub Pages portfolio
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Reverse tabnabbing via `target="_blank"` | Tampering | Add `rel="noopener noreferrer"` to every external link (revly.ca, Roblox, GitHub, LinkedIn — mostly Phase 2/3, but Nav anchors/CTAs set the pattern now) |
| Missing security headers (no CSP/HSTS control on Pages) | Info disclosure | GitHub Pages serves over HTTPS by default; CSP via `<meta http-equiv>` is the only lever (defer to Phase 4 SEO/launch pass — note, don't block) |
| Supply-chain (slopsquat) on install | Tampering | All deps are canonical top-tier packages (see Audit); pin via `package-lock.json` + `npm ci` in CI |
| Leaking visitor IP to third-party font CDN | Info disclosure | Self-host all fonts via `next/font` (already the locked decision) — zero third-party font request |

**No high-severity findings** that would block this phase. The single actionable carry-forward: establish the `rel="noopener noreferrer"` convention on any external link primitive built now.

## Walking-Skeleton Sequencing (ordering constraints)

The planner should respect these hard dependencies (each depends on the prior):
1. **Scaffold** (`create-next-app`) + `next.config.ts` (`output:'export'`, `images.unoptimized`, basePath) + `cn()` + `base-path.ts`. *(Nothing renders correctly without config first.)*
2. **Fonts + tokens** — `next/font` wiring in `layout.tsx` + `@theme inline` in `globals.css`. *(Primitives style against these tokens; must exist before primitives.)*
3. **Primitives** — Button, Card, TechPill, Section, Timeline (shell), Nav. *(Hero/Nav are composed FROM these — build before hero.)*
4. **Hero + Nav composition** — static gradient h1 + `MotionConfig` + client entrance + 3 CTAs (basePath-aware resume, `mailto:`, anchor) + anchors `#work`/`#about`/`#contact`.
5. **Deploy** — GitHub Actions workflow; verify on the LIVE `/jackyzhang` URL that fonts, resume.pdf, and all paths resolve (no 404s). *(LNCH-05 is only satisfied by verifying on the deployed URL, not locally.)*

> Walking-skeleton thinnest slice: the live URL with the styled hero IS the deliverable. Deploy plumbing can be stood up early (even with a near-empty page) to de-risk the basePath verification, then the hero filled in — but tokens/fonts must precede primitives, and primitives must precede the hero composition.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DSYS-01 | Locked tokens (palette, gradient, spacing/radius) as single source | Pattern 2 `@theme inline` block; all tokens enumerated from UI-SPEC |
| DSYS-02 | 3 fonts self-hosted, no FOUT/FOIT/CLS | Pattern 2 (`next/font` local+google, `display:swap`, `@theme inline`); Pitfall 4 |
| DSYS-03 | Reusable primitives (Button, Card, TechPill, Section, Timeline, Nav) | Component structure + Button skeleton; "composed from primitives" contract |
| DSYS-04 | `prefers-reduced-motion` honored + visible keyboard focus | Pattern 5 (`MotionConfig` + CSS guard); focus-visible ring in Button skeleton |
| HERO-01 | Name, identity, one-liner on first screen | Hero composition (D-01/D-02/D-03 copy); `min-h-[100svh]` centering |
| HERO-02 | Builder arc + 3 CTAs (view work, resume, contact) | D-06 CTAs; Button variants; basePath resume + mailto + anchors (D-07/08/09) |
| HERO-03 | LCP heading renders immediately, no opacity-fade; gradient drift reduced-motion safe | Pattern 4 (static h1, no Motion) + Pattern 3 + Pattern 5; Pitfall 3 |
| LNCH-05 | Live on GitHub Pages, asset paths correct (basePath) | Pattern 1 + GitHub Actions workflow + Pitfall 1/5; verify on live URL |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Weekly download counts in the Audit table are order-of-magnitude estimates | Package Legitimacy Audit | Low — verdicts rest on package identity/source repo, not exact counts |
| A2 | `trailingSlash: true` is the friendlier choice for GitHub Pages | Pattern 1 | Low — both work; `true` avoids `/page` → `/page/` redirect quirks. Planner may choose `false`. |
| A3 | Clash Display ships as a single 600-weight `.woff2` the owner self-hosts | Pattern 2 | Medium — owner must obtain the `.woff2` from Fontshare (ITF Free License). If a variable font is used instead, the `localFont` `src` array changes. Action item: confirm font file(s) in `public/fonts/`. |
| A4 | Default color hex values (`#0A0A0F` etc.) from UI-SPEC are final | Pattern 2 | Low — UI-SPEC marks them `[default]` but the contract is approved/binding. |
| A5 | `gh` CLI absence is acceptable (Pages source set via web UI) | Environment Availability | Low — web UI toggle is a standard one-time owner step. |

## Open Questions

1. **Resume PDF availability (D-07)**
   - What we know: Owner will place a real `resume.pdf` in `public/`; the link must be basePath-aware and verified live.
   - What's unclear: Whether the file exists yet at execution time.
   - Recommendation: Plan a `checkpoint:human-verify` (or owner action) confirming `public/resume.pdf` exists before the live-URL verification task; do not ship a 404 link.

2. **Clash Display font files (A3)**
   - What we know: Clash Display is a Fontshare font (ITF Free License, self-hostable); contract loads weight 600 only.
   - What's unclear: Whether the `.woff2` has been downloaded into `public/fonts/`.
   - Recommendation: First font task downloads/places the `.woff2` (Semibold 600); confirm subset/weights before wiring `localFont`.

3. **Repo model: project page confirmed (no custom domain this phase)**
   - What we know: basePath `/jackyzhang` (project page) is locked; custom domain + user-site repo are deferred (DEPTH-02).
   - Recommendation: No action — proceed with basePath `/jackyzhang`; the single-source env var makes a future domain switch a one-line change.

## Sources

### Primary (HIGH confidence)
- nextjs.org/docs/app/guides/static-exports (v16.2.9, updated 2026-03-03) — `output:'export'`, image loader/`unoptimized`, trailingSlash, unsupported features, `out` dir
- npm registry (`npm view`) — live versions: next 16.2.9, react 19.2.7, typescript 6.0.3, tailwindcss 4.3.2, motion 12.42.0, lucide-react 1.22.0, clsx 2.1.1, tailwind-merge 3.6.0, eslint 10.6.0, prettier 3.9.3
- github.com/tailwindlabs/tailwindcss/discussions/15267 — `@theme inline` for next/font CSS variables (via CLAUDE.md sourcing)
- motion.dev/docs/react-motion-component — `motion/react`, client-only, rebrand (via CLAUDE.md sourcing)

### Secondary (MEDIUM confidence)
- github.com/orgs/community/discussions/191018 — GitHub Actions Pages deploy (`configure-pages`/`upload-pages-artifact`/`deploy-pages`), basePath/assetPrefix, `unoptimized`
- wallis.dev/blog/next-js-basepath-and-assetprefix — basePath vs assetPrefix roles for subpath hosting
- owolf.com — custom fonts in Next 15 + Tailwind 4 end-to-end (via CLAUDE.md sourcing)

### Tertiary (LOW confidence)
- Various 2025-2026 "deploy Next.js to GitHub Pages" tutorials (dev.to, Medium) — corroborate config but not authoritative; cross-checked against official static-exports doc

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against npm registry this session
- Static export + GitHub Pages + basePath: HIGH — official Next.js doc + GitHub first-party actions
- Fonts / `@theme inline`: HIGH — official Tailwind discussion + CLAUDE.md vetted sources
- LCP/motion/reduced-motion patterns: HIGH — derived from binding UI-SPEC contract + Motion docs
- Pitfalls: HIGH — each tied to a documented mechanism (basePath scope, optimizer, Jekyll, clip-text)
- Security: HIGH — minimal surface correctly characterized for a static no-input site

**Research date:** 2026-06-29
**Valid until:** 2026-07-29 (stable stack; re-verify `next`/`tailwindcss`/`lucide-react` versions if planning slips a month)

## RESEARCH COMPLETE
