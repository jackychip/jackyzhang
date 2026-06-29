---
phase: 01-live-foundation-design-system-hero
plan: 01
subsystem: foundation
tags: [scaffold, static-export, github-pages, basepath, ci, tooling]
status: complete-local-deploy-deferred
requires: []
provides:
  - "Next.js 16 App Router scaffold (TS strict, Tailwind v4, ESLint, Prettier)"
  - "static-export config (output:export + images.unoptimized + basePath/assetPrefix from NEXT_PUBLIC_BASE_PATH)"
  - "cn() class-composition utility (@/lib/cn)"
  - "withBasePath()/basePath helper (@/lib/base-path)"
  - "GitHub Actions Pages artifact-deploy workflow (.github/workflows/deploy.yml)"
  - "buildable static export emitting out/ with placeholder page"
affects:
  - "every later plan in phase 01 (depends on scaffold + cn + basePath)"
tech-stack:
  added:
    - "next@16.2.9"
    - "react@19.2.4 / react-dom@19.2.4"
    - "typescript@^5 (strict)"
    - "tailwindcss@^4 + @tailwindcss/postcss@^4"
    - "motion@^12.42.0"
    - "lucide-react@^1.22.0"
    - "clsx@^2.1.1"
    - "tailwind-merge@^3.6.0"
    - "prettier@^3.9.3 + prettier-plugin-tailwindcss@^0.6.14 (dev)"
  patterns:
    - "Single NEXT_PUBLIC_BASE_PATH source of truth (RESEARCH Pattern 1)"
    - "GitHub Actions artifact deploy (avoids Jekyll _next/ strip — Pitfall 5)"
key-files:
  created:
    - "next.config.ts"
    - "src/lib/cn.ts"
    - "src/lib/base-path.ts"
    - ".prettierrc"
    - ".github/workflows/deploy.yml"
    - "src/app/page.tsx (placeholder; replaced by 01-04)"
    - "package.json / package-lock.json / tsconfig.json / eslint.config.mjs / postcss.config.mjs / .gitignore (scaffold)"
  modified:
    - "src/app/page.tsx (reduced scaffold default -> minimal placeholder)"
decisions:
  - "lucide-react installed at ^1 (1.22.0), not CLAUDE.md's stale ^0.5xx (PATTERNS Authority Conflicts)"
  - "trailingSlash:true kept (RESEARCH A2 — friendlier on Pages)"
  - "Scaffolded in a temp dir + moved files in, excluding scaffold's CLAUDE.md/AGENTS.md/.git to protect repo files"
metrics:
  duration_min: 4
  completed: 2026-06-29
requirements: [LNCH-05]
---

# Phase 1 Plan 01: Scaffold + Static-Export Config + Deploy Pipeline Summary

Greenfield Next.js 16 (App Router, TS strict, Tailwind v4) app scaffolded and locked for GitHub Pages static export — `output:export` + `images.unoptimized` + a single `NEXT_PUBLIC_BASE_PATH` source driving `basePath`/`assetPrefix` and the runtime `withBasePath()` helper — with a GitHub Actions artifact-deploy workflow and a throwaway placeholder page that builds to a static `out/`. The live-URL verification (Task 3) is deferred to the repo owner because this sandbox has no push/Pages-settings/live-URL access.

## What Was Built

- **Task 1 — Scaffold + static-export config + utils** (commit `bcbae5f`)
  - `create-next-app` (App Router + TS + Tailwind v4 + ESLint + `src/` + `@/*` alias) pinned the matched core set: `next@16.2.9`, `react`/`react-dom@19.2.4`, `typescript@^5`, `tailwindcss@^4`. Scaffolded in a temp dir and moved files into the repo root, deliberately excluding the scaffold's own `CLAUDE.md`, `AGENTS.md`, and `.git` so the project's real `CLAUDE.md` (14588 bytes) and `.planning/` were untouched.
  - Installed runtime deps `motion lucide-react@^1 clsx tailwind-merge` and dev deps `prettier prettier-plugin-tailwindcss`. `lucide-react` resolved to `^1.22.0` (not CLAUDE.md's stale `^0.5xx`).
  - `next.config.ts` rewritten verbatim per RESEARCH Pattern 1: `output:"export"`, `images:{unoptimized:true}`, `basePath`/`assetPrefix` from `process.env.NEXT_PUBLIC_BASE_PATH ?? ""`, `trailingSlash:true`.
  - `src/lib/cn.ts` (`twMerge(clsx(inputs))`) and `src/lib/base-path.ts` (`basePath` + `withBasePath`) created verbatim from RESEARCH snippets. `tsconfig.json` already `strict:true` (scaffold default — satisfies CLAUDE.md). Added `.prettierrc` enabling `prettier-plugin-tailwindcss`.

- **Task 2 — Deploy workflow + placeholder page** (commit `96af285`)
  - `.github/workflows/deploy.yml`: trigger on push to `main` + `workflow_dispatch`; least-privilege `permissions` (contents:read, pages:write, id-token:write); `concurrency: pages`. Build job = checkout → setup-node@v4 (node 20, npm cache) → configure-pages@v5 → `npm ci` → `npm run build` with `env: NEXT_PUBLIC_BASE_PATH: /jackyzhang` → upload-pages-artifact@v3 (`./out`); deploy job = deploy-pages@v4 in the `github-pages` environment. Artifact deploy (not branch) keeps `_next/` untouched by Jekyll (Pitfall 5).
  - `src/app/page.tsx` reduced from the scaffold default to a single-heading placeholder ("Jacky Zhang — coming soon"); no `public/` asset references (resume/OG land later). Fully composed in 01-04.

## Verification Results

- **Task 1** (`TASK1_OK`): `npm run build` exits 0 and emits `out/` with `index.html` + `_next/`; `next.config.ts` contains `output` + `unoptimized`; `base-path.ts` exports `withBasePath`; `cn.ts` exports `cn`; `tsconfig.json` has `"strict": true`.
- **Task 2** (`WORKFLOW_OK`): `npm run build` regenerates `out/index.html` (placeholder text "Jacky Zhang — coming soon" present in the prerendered HTML); `deploy.yml` is valid YAML with `build` + `deploy` jobs; `NEXT_PUBLIC_BASE_PATH: /jackyzhang`, `upload-pages-artifact`, and `deploy-pages` all present.
- TypeScript type-check passes under `strict` as part of `next build`.

## Deviations from Plan

### Auto-fixed / Environment Adaptations

**1. [Rule 3 - Blocking] pyyaml not installed for workflow YAML validation**
- **Found during:** Task 2 verification.
- **Issue:** The plan's verify command uses `python3 -c "import yaml..."` but `pyyaml` was absent (`ModuleNotFoundError: No module named 'yaml'`).
- **Fix:** Installed `pyyaml` via `python3 -m pip install pyyaml --quiet`, then ran the exact verification — passed (`YAML_OK`, jobs `build`+`deploy`). This is a local tooling gap, not a code issue; no plan code changed.

**2. [Note] prettier-plugin-tailwindcss resolved to ^0.6.14**
- npm resolved `prettier-plugin-tailwindcss` to `^0.6.14` rather than RESEARCH's quoted `0.8.0` (latest compatible with the installed prettier). Functionally equivalent for class sorting; no action needed.

No other deviations — Task 1 and Task 2 executed as written.

## Known Stubs

- **`src/app/page.tsx`** — intentional throwaway placeholder ("Jacky Zhang — coming soon"). Documented as such in the plan; the real Hero is composed in plan **01-04**. The default scaffold `layout.tsx` (Geist fonts, "Create Next App" metadata) is likewise still in place and is replaced by the font/token wiring in plan **01-02**. These are expected walking-skeleton stubs, not gaps.

## Deferred — Owner Action Required

Task 3 (`checkpoint:human-action`, `gate="blocking"`) verifies the LIVE deployment. This sandbox has **no push credentials, no `gh` CLI, no access to GitHub repo Settings, and no browser/network access to the live URL**, so the live truths below are **NOT verified** — they are pending the owner. The locally-buildable code that produces the deploy is complete and verified.

**Pending must-have truths (NOT yet verified):**
- `https://jackychip.github.io/jackyzhang/` returns HTTP 200.
- `_next/` static CSS/JS assets resolve under the `/jackyzhang` basePath on the live URL (no 404s).

**Exact owner steps (from Task 3 `how-to-verify`):**
1. In the GitHub repo, open **Settings → Pages → Build and deployment** and set **Source = "GitHub Actions"** (one-time web-UI toggle; no `gh` CLI available).
2. Push the latest `main` (commits `bcbae5f`, `96af285`, and the docs commit) so the **"Deploy to GitHub Pages"** workflow runs; wait for it to finish green in the **Actions** tab.
3. Visit `https://jackychip.github.io/jackyzhang/` — the placeholder must load (HTTP 200), styled (Tailwind base applied), with **no 404s** for `_next/static/...` assets in the browser network tab. This proves basePath + `_next/` serving end-to-end before any design work.

**Resume signal:** Type **"approved"** once the Pages source is set to GitHub Actions and the live placeholder URL loads with no `_next/` 404s, or describe the failure.

> Local proof the deploy will work: `npm run build` (and a basePath build via `NEXT_PUBLIC_BASE_PATH=/jackyzhang npm run build`) succeeds and emits a static `out/` with `index.html` + `_next/`; the workflow uploads exactly this `out/` as the Pages artifact. The only unverified link is the live GitHub-side publish, which requires the owner's one-time Settings toggle + push.

## Notes for Next Plan (01-02)

- `cn` (`@/lib/cn`) and `withBasePath`/`basePath` (`@/lib/base-path`) are ready to import.
- `layout.tsx` still has the scaffold's Geist fonts + default metadata and `globals.css` is the scaffold default — 01-02 replaces these with the three self-hosted fonts (`next/font`), the `@theme inline` token block, and the `MotionConfig reducedMotion="user"` provider.
- A cosmetic Tailwind v4 build warning (`Unexpected token Delim('|')` on a `rounded-[var(--radius-sm|md|lg|pill)]` candidate) appears during `next build`; it originates from Tailwind's content scan picking up a token-doc string, the build still exits 0, and it is expected to disappear once the real `@theme` tokens land in 01-02. Out of scope for this plan; not fixed here.

## Self-Check: PASSED

- FOUND: next.config.ts, src/lib/cn.ts, src/lib/base-path.ts, .github/workflows/deploy.yml, src/app/page.tsx, .prettierrc
- FOUND commit bcbae5f (Task 1), FOUND commit 96af285 (Task 2)
- out/index.html generated with placeholder content; no unexpected file deletions; no stray untracked files.
