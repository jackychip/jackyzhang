<!-- GSD:project-start source:PROJECT.md -->

## Project

**Jacky Zhang — Personal Website**

A personal website for Jacky Zhang — a Computer Engineering student at UIUC (B.S. expected May 2029) and a multi-domain builder: founder & lead engineer of Revly (a live automotive-services marketplace), freelance full-stack developer, robotics programmer (Team Canada RoboCup + an ML-driven robotic arm), and a Roblox game developer with 40k+ plays. The site is a recruiting-focused portfolio that signals "I ship real things" to tech recruiters and engineering hiring managers, led by a bold, founder-energy visual identity.

**Core Value:** A recruiter or hiring manager lands on the site and within seconds understands that Jacky is a serious builder worth interviewing — backed by concrete, verifiable projects and credibility signals.

### Constraints

- **Tech stack**: Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + `motion` (formerly Framer Motion). Modern industry-standard stack that doubles as a recruiting signal and overlaps with known skills.
- **Deployment**: GitHub Pages — **static export** (`output: export`). No server runtime → static OG image, `mailto:` contact, unoptimized/pre-optimized images, and `basePath` handling if served from a project page (`jackychip.github.io/jackyzhang`) rather than a user-site repo.
- **Design direction**: Bold & modern "founder" aesthetic, dark-first — locked design system (see Key Decisions). Accessibility-aware: gradient reserved for large display headings only; body text stays solid near-white.
- **Scope**: v1 is a focused, static, recruiting-oriented portfolio. No blog, CMS, or backend.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js** | `16.2.x` | React framework, App Router, build, image/font optimization, Vercel deploy target | Current major (16). App Router + React Server Components is the default and the recruiting-signal "modern" baseline. Static export of a portfolio is trivial; built-in `next/font` and `next/image` remove the two biggest perf footguns for free. |
| **React** | `19.2.x` | UI library | Bundled/peer-matched with Next 16. React 19 is stable and is what Next 16's App Router expects. |
| **TypeScript** | `6.0.x` (or `5.7+`) | Type safety, recruiter-visible code quality | TS is itself a recruiting signal. TS 6.0 is current and supported by Next 16; `5.7+` is a safe floor if you hit any tooling lag. Use `strict: true`. |
| **Tailwind CSS** | `4.3.x` | Utility-first styling + design-token system | **v4 is CSS-first** — theme tokens live in `globals.css` under `@theme`, not a JS config. Perfect fit for a small, locked dark design system: define the violet→blue→cyan gradient stops, font families, and dark palette once as tokens. ~5x faster builds than v3. |
| **Motion** (`motion`) | `12.42.x` | Animation / scroll reveals / hero motion | **`framer-motion` was renamed to `motion`.** Install `motion`, import from `motion/react`. Same API. This is the single animation dependency — do not add others. |
| **Vercel** | platform | Hosting, CI/CD, CDN, image optimization, analytics | Zero-config for Next.js, native `next/image` optimization at the edge, automatic preview deploys per push, free tier covers a personal site. The intended target; nothing to configure beyond connecting the repo. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **`next/font`** (built-in) | n/a | Self-hosted, zero-layout-shift font loading | Always. `next/font/google` for **Inter** + **JetBrains Mono**; `next/font/local` for **Clash Display** (see Font Setup below). |
| **`next/image`** (built-in) | n/a | Responsive images, AVIF/WebP, lazy-load, no CLS | Always, for every project screenshot / OG asset. Set explicit `width`/`height` or `fill` + `sizes`. |
| **`lucide-react`** | `^0.5xx` (latest) | Icon set (GitHub, mail, arrow, external-link) | Always. Tree-shakeable, stroke-based, matches a clean modern aesthetic. One import per icon. |
| **`clsx`** + **`tailwind-merge`** | latest | Conditional + conflict-safe class composition | Always — wrap in a `cn()` util. Prevents class-collision bugs once you have variant-driven components. |
| **`@vercel/analytics`** | latest | Privacy-light visitor analytics | Recommended — see *which* sections recruiters reach and which projects get clicks. |
| **`@vercel/speed-insights`** | latest | Real-user Core Web Vitals | Recommended — a portfolio's whole pitch is "I ship fast things"; prove it with green LCP/CLS. |
| **`shadcn/ui`** (CLI, copy-in) | latest | Optional unstyled Radix primitives | Only if you need accessible primitives (dialog, accordion for the experience timeline). Copy-in, not a dependency; you own and Tailwind-style the code. Do **not** pull a full component kit (see What NOT to Use). |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **ESLint** (`eslint-config-next`) | Linting | Use the config scaffolded by `create-next-app`. ESLint 10 + flat config. |
| **Prettier** + **`prettier-plugin-tailwindcss`** | Formatting + automatic Tailwind class sorting | The plugin keeps utility classes in canonical order — readable diffs and recruiter-readable source. |
| **`@tailwindcss/postcss`** | Tailwind v4 PostCSS plugin | v4's build path. `create-next-app --tailwind` wires this automatically. There is no `tailwind.config.js` by default in v4. |

## Installation

# Scaffold (App Router + TS + Tailwind v4 + ESLint, all flags pre-answered)

# Animation (note: the package is "motion", not "framer-motion")

# Supporting

# Dev

## Font Setup (the load-bearing detail)

### Tailwind v4 theme tokens (CSS-first — wires fonts + dark design system)

## Image / Asset Optimization

- **`next/image` for every raster asset.** Serves AVIF/WebP, responsive `srcset`, lazy-loads below the fold, reserves space (no CLS). Vercel runs the optimizer at the edge for free.
- **Set `priority` on the hero/LCP image only**; leave everything else lazy.
- **SVGs** (logos, icons): inline as React components or use `lucide-react`; don't route SVGs through `next/image`.
- **Resume PDF**: drop in `public/`, link directly (`/resume.pdf`); it's a static asset, no optimization needed.
- **OG / social-share image**: generate with `next/og` (`ImageResponse`) so the link preview a recruiter pastes into Slack looks intentional.
- Pre-compress source screenshots to a sane max width (~1600px) before committing — the optimizer is not a license to ship 5MB PNGs.

## Vercel Deployment Specifics

- **Connect the GitHub repo** → Vercel auto-detects Next.js, sets build command (`next build`) and output with **zero config**. Every push to `main` = production deploy; every PR/branch = a preview URL.
- **Fonts**: because both `next/font` strategies self-host, the deployed site makes **no third-party font request** — good for LCP and privacy.
- **Image optimization** works out of the box; no `next.config` loader needed.
- **Add a custom domain** in project settings (a `jackyzhang.dev`-style domain reads better to recruiters than `*.vercel.app`).
- **Mount analytics**: add `<Analytics />` and `<SpeedInsights />` in the root layout.
- Consider `output: "export"` only if you ever want to host elsewhere — **not recommended here**, because static export disables `next/image` optimization and `next/og`. Stay on the default Vercel runtime.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `next/font/local` (self-host Clash Display) | Fontshare CDN `@import` | Never for production. Only acceptable for a throwaway prototype before you download the files. |
| Tailwind v4 CSS-first `@theme` | `tailwind.config.ts` (JS config) | If a plugin you need only supports JS config. v4 still allows a config file via `@config`, but the design system here is small enough to live in CSS. |
| Motion (`motion`) | CSS-only animations / `tailwindcss-animate` | For purely decorative hover/fade with no orchestration, CSS keyframes are lighter. Use Motion for hero entrance, scroll reveals (`whileInView`), and `AnimatePresence`. |
| `next/image` | Plain `<img>` | Only for tiny inline SVGs or when an asset is already perfectly sized and you explicitly opt out of optimization. |
| Vercel | Netlify / Cloudflare Pages | Both work, but Vercel is the first-party Next.js host with the smoothest `next/image` + analytics story. No reason to deviate. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Fontshare CDN `<link>`/`@import` for Clash Display** | Render-blocking external request, FOUT/layout shift, third-party uptime dependency, no Next font optimization, leaks visitor IP to a CDN | Download the `.woff2` and load via `next/font/local` |
| **`framer-motion` (old package name)** | Deprecated alias; the project moved to `motion` | `npm install motion`, `import { motion } from "motion/react"` |
| **Stacking multiple animation libs** (GSAP + ScrollMagic, react-spring, AOS, Lottie-for-everything) | Bundle bloat, jank, competing rAF loops — kills the "fast site" pitch | One library: Motion. Use `whileInView` for scroll reveals |
| **Heavy component kits** (MUI, Chakra, Ant Design) | Opinionated default styling fights a custom dark/founder design system; large runtime; generic look that signals "template" | Tailwind utilities; copy-in `shadcn/ui` primitives only where you need accessibility |
| **Runtime CSS-in-JS** (styled-components, Emotion) | Runtime cost + RSC/App Router friction (extra `"use client"`, registries) | Tailwind v4 (zero-runtime) |
| **Pages Router** | Legacy; misses RSC, current `next/font`/metadata ergonomics, and reads as dated to engineers | App Router (`app/`) |
| **State libraries** (Redux, Zustand, Jotai) | A static portfolio has no shared app state | Local component state / props only |
| **`output: export` + external image loader** | Disables `next/image` optimization and `next/og` on Vercel | Default Vercel runtime |
| **Forgetting `"use client"` on Motion components** | Motion is client-only; using it in a Server Component throws | Mark interactive/animated components `"use client"`, or import `motion/react-client` |

## Stack Patterns by Variant

- Skip `shadcn/ui` entirely; build the ~5 sections with raw Tailwind + Motion.
- Because the site has only a handful of components, a kit adds more than it saves.
- Add `shadcn/ui` (Accordion, Dialog, Tabs) selectively via its CLI.
- Because Radix gives keyboard/ARIA correctness you'd otherwise hand-roll — and recruiters' assistive-tech checks shouldn't fail.
- Load only the 2–3 static weights you actually use (e.g. Medium 500, Semibold 600, Bold 700) as separate `.woff2` via the `localFont` `src` array.
- Because the hero likely uses just a couple of display weights; static subsets can beat the full variable file.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.2.x` | `react@19.2.x`, `react-dom@19.2.x` | Matched set; let `create-next-app` pin them together. |
| `next@16` | `tailwindcss@4.3.x` + `@tailwindcss/postcss` | v4 PostCSS pipeline; no `tailwind.config.js` required. |
| `tailwindcss@4` | `next/font` CSS variables | **Must** use `@theme inline` to resolve injected font variables. |
| `motion@12.42.x` | `react@19` | Import from `motion/react`; client components only. |
| `typescript@6.0.x` | `next@16` | Supported; drop to `5.7+` only if a tool lags behind TS 6. |

## Sources

- npm registry (`npm view`) — live latest versions: `next@16.2.9`, `react@19.2.7`, `typescript@6.0.3`, `tailwindcss@4.3.2`, `motion@12.42.0`, `eslint@10.6.0`, `prettier@3.9.3` — **HIGH**
- [Motion for React docs — `motion/react` component](https://motion.dev/docs/react-motion-component) — rebrand + import path + client-only behavior — **HIGH**
- [Tailwind CSS — Theme variables](https://tailwindcss.com/docs/theme) and [GitHub discussion #15267 — next/font variables in v4 theme](https://github.com/tailwindlabs/tailwindcss/discussions/15267) — `@theme inline` pattern — **HIGH**
- [Fontshare — Clash Display](https://www.fontshare.com/fonts/clash-display) + [Freebiesbug overview](https://freebiesbug.com/free-fonts/clash-display/) — 6 weights (Extralight–Bold) + variable, ITF Free Font License (free commercial), downloadable/self-hostable — **HIGH**
- [Vercel — Custom fonts with `next/font`](https://vercel.com/blog/nextjs-next-font) and [Next.js discussion #25389 — self-hosting fonts](https://github.com/vercel/next.js/discussions/25389) — `next/font/local`, woff2, `display: swap`, file placement — **HIGH**
- [owolf — Custom fonts in Next.js 15 + Tailwind 4](https://www.owolf.com/blog/how-to-use-custom-fonts-in-a-nextjs-15-tailwind-4-app) — end-to-end next/font + `@theme inline` wiring — **MEDIUM**

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
