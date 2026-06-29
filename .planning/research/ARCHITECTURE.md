# Architecture Research

**Domain:** Next.js (App Router) single-page personal portfolio / recruiting site
**Researched:** 2026-06-29
**Confidence:** HIGH

## Standard Architecture

A modern personal portfolio is a **statically-rendered, content-as-code single page**. There is no backend, no database, no client state store. The "architecture" is really three concerns: a **design-system layer** (tokens + primitives), a **section layer** (composed page regions), and a **content layer** (typed data arrays). Everything renders as React Server Components by default; only the thin animation wrappers and any interactive bits opt into the client.

### System Overview

```
┌───────────────────────────────────────────────────────────────┐
│                    app/  (Next.js App Router)                  │
│   layout.tsx (fonts, metadata, <html> shell)                   │
│   page.tsx   (composes sections in order)                      │
│   opengraph-image.tsx (generated OG card)                      │
├───────────────────────────────────────────────────────────────┤
│                       SECTION LAYER  (RSC)                     │
│  ┌────────┐ ┌──────────┐ ┌───────┐ ┌─────────┐ ┌──────────┐   │
│  │  Hero  │ │ Projects │ │ About │ │ Resume  │ │ Contact  │   │
│  └───┬────┘ └────┬─────┘ └───┬───┘ └────┬────┘ └────┬─────┘   │
│      │ maps over content data, composes primitives             │
├──────┴───────────┴───────────┴──────────┴───────────┴─────────┤
│              DESIGN-SYSTEM LAYER  (primitives)                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌─────────┐ ┌──────┐ ┌─────────┐  │
│  │Button│ │ Card │ │ Pill │ │ Section │ │ Nav  │ │Timeline │  │
│  └──────┘ └──────┘ └──────┘ └─────────┘ └──────┘ └─────────┘  │
│  + motion wrappers: FadeIn / SlideIn / Reveal (client)        │
├───────────────────────────────────────────────────────────────┤
│   TOKEN LAYER (globals.css @theme)   CONTENT LAYER (content/)  │
│   colors · gradient · fonts · radii   projects.ts experience.ts│
│   spacing — CSS vars + utilities      socials.ts  siteMeta.ts  │
└───────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/layout.tsx` | HTML shell, font loading, root `metadata`, global CSS import | RSC, `next/font` declarations, exported `metadata` object |
| `app/page.tsx` | Compose sections in narrative order (Hero → Projects → About → Resume → Contact) | RSC, imports section components, no logic |
| Section components | Own one page region; pull from content data; lay out primitives | RSC; `<Projects/>` maps `projects[]` → `<ProjectCard/>` |
| Primitives (Button, Card, Pill, Section) | Reusable, content-agnostic visual building blocks | RSC, styled with Tailwind utilities reading tokens |
| Nav | Sticky/anchor navigation, smooth-scroll to sections, mobile menu | Client component (uses scroll state / menu toggle) |
| Timeline | Render experience entries vertically with connectors | RSC for markup; wrap rows in a motion reveal |
| Motion wrappers (FadeIn/SlideIn/Reveal) | Scroll-in animation + reduced-motion gating | `"use client"`, thin wrappers over `motion` |
| Token layer (`globals.css`) | Single source of truth for palette, gradient, fonts, radii | Tailwind v4 `@theme` block → CSS vars + utilities |
| Content layer (`content/*.ts`) | Typed data for projects, experience, socials, site meta | Plain TS arrays exported with `as const` + interfaces |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx          # fonts, <html>/<body>, root metadata, globals.css
│   ├── page.tsx            # composes sections only — no business logic
│   ├── globals.css         # @import "tailwindcss" + @theme tokens + base layer
│   ├── opengraph-image.tsx # generated 1200×630 OG card (next/og ImageResponse)
│   ├── icon.tsx (or favicon) and twitter-image.tsx
│   └── sitemap.ts / robots.ts  # SEO file conventions
├── components/
│   ├── ui/                 # design-system PRIMITIVES (content-agnostic)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── pill.tsx        # tag / badge / "30k+ plays" metric chip
│   │   ├── section.tsx     # consistent vertical rhythm + max-width container
│   │   └── timeline.tsx
│   ├── sections/           # PAGE REGIONS (content-aware, one per narrative beat)
│   │   ├── hero.tsx
│   │   ├── projects.tsx
│   │   ├── about.tsx
│   │   ├── resume.tsx
│   │   └── contact.tsx
│   ├── nav.tsx             # sticky nav + mobile menu (client)
│   └── motion/             # animation wrappers (client) + variants
│       ├── fade-in.tsx
│       ├── reveal.tsx
│       └── variants.ts     # shared transition/variant constants
├── content/                # TYPED CONTENT DATA (the "CMS")
│   ├── projects.ts
│   ├── experience.ts
│   ├── socials.ts
│   └── site.ts             # name, tagline, SEO defaults, OG strings
├── lib/
│   └── utils.ts            # cn() class-merge helper, formatters
└── types/
    └── content.ts          # Project, Experience, Social interfaces
public/
├── resume.pdf              # downloadable resume (static asset)
├── og.png (optional static fallback) and fonts/ClashDisplay.woff2
└── images/projects/*       # project thumbnails / screenshots
```

### Structure Rationale

- **`components/ui/` vs `components/sections/`:** This is the load-bearing boundary. `ui/` primitives know *nothing* about Jacky — they take props and render. `sections/` know about content and compose primitives. This split is what lets the design system be built and reviewed *before* any real copy exists, and keeps sections thin.
- **`content/` as a typed "CMS":** Project/experience data lives in TS arrays, not hardcoded in JSX. PROJECT.md rules out a CMS/backend, so typed config files are the correct middle ground — type-safe, refactor-friendly, version-controlled, zero runtime cost. MDX is overkill here (no long-form prose; v1 explicitly has no blog).
- **`components/motion/` isolated:** All `"use client"` animation logic is quarantined in one folder so the rest of the tree stays RSC. Variants live in one file so timing/easing stay consistent.
- **`app/` file conventions for SEO:** `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`, `icon.tsx` use Next's metadata file conventions — zero config, framework-native.
- **`public/resume.pdf`:** A static file in `public/` is served at `/resume.pdf` and links with `download` — no API route needed.

## Architectural Patterns

### Pattern 1: Tailwind v4 `@theme` as the single token source

**What:** Define the dark palette, the violet→blue→cyan gradient stops, fonts, and radii once inside an `@theme` block in `globals.css`. Tailwind v4 exposes each as both a CSS variable (`var(--color-accent)`) and a utility class (`bg-accent`). This is the v4 replacement for `tailwind.config.js theme.extend`.

**When to use:** Always, for this stack. It is the current idiomatic approach (Tailwind v4, CSS-first config).

**Trade-offs:** CSS-first means less JS-land configurability, but for a fixed design system that is a feature, not a cost. One source of truth, no config/markup drift.

**Example:**
```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-bg:      #0a0a0f;     /* dark-first base */
  --color-surface: #14141c;
  --color-fg:      #e7e7ee;
  --color-violet:  #7C3AED;
  --color-blue:    #2563EB;
  --color-cyan:    #06B6D4;
  --font-display:  "Clash Display", sans-serif;
  --font-sans:     var(--font-inter), sans-serif;
  --font-mono:     var(--font-jetbrains), monospace;
}

/* reusable signature gradient as a single utility-friendly var */
:root { --gradient-brand: linear-gradient(120deg,#7C3AED,#2563EB,#06B6D4); }
```
Then `bg-violet`, `text-fg`, `font-display` all exist as utilities, and the gradient is reused via `bg-[image:var(--gradient-brand)]` or a `.text-gradient` base-layer class for headings.

### Pattern 2: Server Components by default, client only at the leaves

**What:** Every section and primitive is an RSC. Only `nav.tsx` (scroll/menu state) and the `motion/` wrappers (`"use client"`) ship JS. Sections import a wrapper and pass children: `<Reveal><ProjectCard .../></Reveal>`.

**When to use:** Always. It minimizes the client bundle — critical for the "fast first impression" core value.

**Trade-offs:** You must consciously place the client boundary at wrappers, not whole sections. Wrapping a section's *children* (not the section itself) in a motion component keeps server-rendered content out of the client bundle while still animating it.

**Example:**
```tsx
// components/motion/reveal.tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;            // honor preference: render static
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 3: Content-as-typed-data, sections map over it

**What:** Projects and experience are arrays of typed objects. Sections render by mapping, never by hardcoding repeated JSX.

**When to use:** Any time there is a list (projects, experience, socials). It makes reordering/adding entries a one-line data change and guarantees uniform markup.

**Trade-offs:** Slightly more upfront type definition; pays back immediately on the 4+ projects and multi-row timeline.

**Example:**
```ts
// types/content.ts
export interface Project {
  slug: string;
  title: string;
  blurb: string;
  metrics: string[];          // ["30k+ plays", "100+ concurrent"]
  tags: string[];             // ["Roblox", "Lua"]
  href?: string;
  image?: string;
  featured?: boolean;
}
// content/projects.ts
export const projects: Project[] = [ /* games, fintech MVP, robotics, EV study */ ];
```
```tsx
// components/sections/projects.tsx (RSC)
{projects.map((p, i) => (
  <Reveal key={p.slug} delay={i * 0.08}>
    <ProjectCard project={p} />
  </Reveal>
))}
```

### Pattern 4: Font loading via `next/font` (Google + local)

**What:** Inter and JetBrains Mono load via `next/font/google`; **Clash Display is not on Google Fonts** (it's a Fontshare font) so it loads via `next/font/local` from `public/fonts/` or `src/fonts/`. Each exposes a CSS variable applied on `<html>`.

**When to use:** Always — `next/font` self-hosts, eliminates layout shift (size-adjust), and removes render-blocking font requests.

**Trade-offs:** Clash Display requires committing the `.woff2` file and a local-font declaration; trivial one-time setup.

**Example:**
```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono  = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const clash = localFont({ src: "../fonts/ClashDisplay-Variable.woff2", variable: "--font-clash" });
// <html className={`${inter.variable} ${mono.variable} ${clash.variable}`}>
```

## Data Flow

### Render Flow (build time — fully static)

```
content/*.ts (typed arrays)
        ↓ import
sections/*.tsx (RSC map over data)  →  ui/* primitives (props in, markup out)
        ↓ compose
app/page.tsx  →  app/layout.tsx (fonts + metadata)
        ↓ next build (SSG)
Static HTML/CSS  →  Vercel CDN  →  Recruiter's browser
        ↓ hydrate (minimal)
only nav + motion wrappers ship JS
```

### Animation / Interaction Flow

```
Element enters viewport
        ↓
motion wrapper (whileInView, once:true)
        ↓ checks useReducedMotion()
   reduced? → render static children (no transform)
   else     → fade/slide variant plays once
Hero gradient drift: CSS keyframe animation, also gated by
@media (prefers-reduced-motion: reduce) { animation: none }
```

### Key Data Flows

1. **Content edit:** Edit `content/projects.ts` → typed → section re-maps → done. No component changes.
2. **Token change:** Edit one `@theme` var (e.g. shift cyan) → every utility + the gradient update globally.
3. **Resume download:** `<a href="/resume.pdf" download>` → static file from `public/`, no route.
4. **SEO/OG:** `metadata` export in `layout.tsx` + `opengraph-image.tsx` → crawler/social-card consumption.

## Scaling Considerations

This is a single static page; "scale" means content growth and maintainability, not traffic (Vercel CDN absorbs traffic trivially).

| Scale | Architecture Adjustments |
|-------|--------------------------|
| v1 (5 sections, ~4 projects) | Single `page.tsx`, flat `content/` files — current plan is correct |
| Growth (project detail pages) | Promote `content/projects.ts` slugs to `app/projects/[slug]/page.tsx` dynamic routes; consider MDX per project |
| Heavy growth (blog returns) | Add `content/` collection + a lib like Contentlayer/`fumadocs` or `app/blog/` MDX — explicitly out of scope for v1 |

### Scaling Priorities

1. **First "bottleneck" is maintainability, not perf:** keep the ui/sections/content split clean so adding a project stays a one-file change.
2. **Bundle size is the only real perf lever:** keep client components to nav + motion wrappers; if Framer Motion bundle matters, adopt `LazyMotion` + the `m` component to cut motion JS to ~5kb.

## Anti-Patterns

### Anti-Pattern 1: Hardcoding content inside section JSX

**What people do:** Write each project as bespoke markup directly in `projects.tsx`.
**Why it's wrong:** Inconsistent cards, painful reordering, copy changes require touching components, no type safety.
**Do this instead:** Typed arrays in `content/`, sections map over them into one `ProjectCard` primitive.

### Anti-Pattern 2: Marking whole sections `"use client"` for one animation

**What people do:** Slap `"use client"` on `hero.tsx`/`projects.tsx` so they can use Framer Motion.
**Why it's wrong:** Pulls all that markup into the client bundle, defeating RSC and slowing first paint — the opposite of the "fast first impression" goal.
**Do this instead:** Keep sections as RSC; wrap their *children* in small client `motion/` wrappers.

### Anti-Pattern 3: Animations with no reduced-motion path

**What people do:** Ship scroll-fades and a drifting hero gradient with no `prefers-reduced-motion` handling.
**Why it's wrong:** Accessibility failure; can trigger motion sickness; a poor signal on a *recruiting* site that should demonstrate craft.
**Do this instead:** Gate JS animations with `useReducedMotion()` (render static fallback) and CSS animations with `@media (prefers-reduced-motion: reduce)`.

### Anti-Pattern 4: Duplicating the gradient/palette across files

**What people do:** Re-declare the violet→blue→cyan gradient inline in hero, buttons, headings.
**Why it's wrong:** Drift — stops diverge, one tweak means hunting many files.
**Do this instead:** One `--gradient-brand` var + `@theme` colors; reference everywhere.

### Anti-Pattern 5: Reaching for a CMS / MDX / state library

**What people do:** Add Contentlayer, Sanity, Zustand, or Redux "to be safe."
**Why it's wrong:** Zero payoff for a static 5-section page; adds build complexity and bundle weight. PROJECT.md explicitly scopes these out.
**Do this instead:** Typed TS data files; no client state store needed.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel | `git push` → auto build/deploy | Zero-config for Next.js; preview deploys per branch |
| Google Fonts (Inter, JetBrains Mono) | `next/font/google` self-host | No runtime request; variable fonts |
| Fontshare (Clash Display) | `next/font/local` from committed `.woff2` | Not on Google Fonts — must self-host the file |
| GitHub / email (contact) | Plain `<a href>` links | `mailto:` + GitHub URL; no form/back end in v1 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| sections ↔ ui primitives | Props (data in, markup out) | Primitives stay content-agnostic |
| sections ↔ content data | Direct import of typed arrays | One-way; content never imports components |
| sections ↔ motion wrappers | Children composition | Client boundary lives only in wrappers |
| tokens ↔ everything | CSS vars + Tailwind utilities | `@theme` is the only place values are defined |

## Suggested Build Order (for roadmap phasing)

1. **Foundation + design system first.** Scaffold Next.js (App Router, TS, Tailwind v4) → wire `next/font` (incl. local Clash Display) → define `@theme` tokens + gradient → build `ui/` primitives (Button, Card, Pill, Section, Nav, Timeline) on a throwaway preview page. *Rationale:* sections are thin compositions of these; building them first makes section work fast and consistent, and the design system can be reviewed in isolation.
2. **Content model.** Define `types/content.ts` + populate `content/*.ts` (projects, experience, socials, site). *Rationale:* sections need data to map over; cheap to do before/with sections.
3. **Sections.** Build Hero → Projects → About → Resume → Contact, composing primitives over content. *Rationale:* the narrative arc (games → fintech → robots).
4. **Motion + accessibility.** Add `motion/` wrappers (scroll reveals, hero gradient drift) with reduced-motion gating. *Rationale:* layer animation onto working static markup so the site degrades gracefully and stays testable.
5. **SEO, OG, polish, deploy.** `metadata`, `opengraph-image.tsx`, `sitemap.ts`/`robots.ts`, favicon, `public/resume.pdf`, Lighthouse pass, Vercel deploy. *Rationale:* finishing touches once content is final.

## Sources

- [Motion (formerly Framer Motion) — React accessibility / useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) — HIGH (official docs)
- [Motion — reduce bundle size (LazyMotion / m component)](https://motion.dev/docs/react-reduce-bundle-size) — HIGH (official docs)
- [Motion & Framer Motion upgrade guide (package rename to `motion`)](https://motion.dev/docs/react-upgrade-guide) — HIGH (official docs)
- [Tailwind CSS — Theme variables (`@theme`) core concepts](https://tailwindcss.com/docs/theme) — HIGH (official docs)
- [Tailwind CSS v4.0 release notes (CSS-first config)](https://tailwindcss.com/blog/tailwindcss-v4) — HIGH (official docs)
- Next.js App Router conventions (`next/font`, metadata files, `opengraph-image`, RSC defaults) — HIGH (framework-native, stable)

---
*Architecture research for: Next.js App Router personal portfolio (recruiting site)*
*Researched: 2026-06-29*
