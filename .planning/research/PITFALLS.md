# Pitfalls Research

**Domain:** Bold, animated, dark-themed recruiting portfolio (Next.js + Tailwind + Framer Motion, static, on Vercel)
**Researched:** 2026-06-29
**Confidence:** HIGH

> Scope note: This is a single-page-ish static marketing site for an audience of one type — recruiters scanning for signal in 10–30 seconds. "Scale" here is not concurrent users; it is *mobile devices, throttled CPUs, and screen readers*. Pitfalls are framed accordingly.

## Critical Pitfalls

### Pitfall 1: Hero fades in from `opacity: 0` and tanks LCP

**What goes wrong:**
The signature move for a "bold founder" hero is a Framer Motion entrance: headline starts at `opacity: 0`, slides/fades in over 400–800ms. But the hero headline (Clash Display, large) is almost always the **Largest Contentful Paint element**. Lighthouse records LCP at the moment the element is actually painted at its final state — so a 600ms fade *adds 600ms to your LCP directly*, plus the time to download + parse the Framer Motion bundle before the animation can even start. On a throttled mid-range Android (Lighthouse mobile default), Framer's JS that runs in ~20ms on a MacBook takes 200–400ms. Result: a visually gorgeous hero that scores 50s–70s on Lighthouse mobile and shows LCP of 3.5s+.

**Why it happens:**
The animation looks instant on the developer's M-series Mac on localhost. The performance cost is invisible until you test on throttled mobile, which most students never do.

**How to avoid:**
- **Never animate the LCP element's opacity from 0.** Render the hero headline at full opacity on first paint. Animate *secondary* elements (sub-text, CTA buttons, decorative gradient blobs) instead, or use a transform-only entrance (translateY) while keeping opacity at 1 — though even transforms can confuse the LCP heuristic, so prefer animating non-LCP elements.
- If a hero entrance is non-negotiable, keep it short (<300ms) and make the gradient/background the animated element, not the text.
- Lazy-load Framer Motion features (`LazyMotion` + `domAnimation`/`domMax`) so the full bundle isn't blocking first paint.
- Consider CSS-only animations (`@keyframes`, Tailwind `animate-*`) for the hero entrance — zero JS cost, runs on the compositor.

**Warning signs:**
Lighthouse mobile Performance < 90; LCP > 2.5s; the headline visibly "arrives" after the page paints; LCP element in the Lighthouse report is the hero `<h1>`.

**Phase to address:**
Hero/landing phase (build it animation-correct from the start — retrofitting means redoing the hero). Re-verify in the final performance/polish phase.

---

### Pitfall 2: Dark theme + gradient text fails WCAG contrast

**What goes wrong:**
On a dark background, the violet→blue→cyan gradient is used as text fill (gradient headings via `background-clip: text`) or for body/secondary text. The violet end (`#7C3AED`) on a near-black background is around 4:1 or below; gradient text has *no single contrast ratio*, so parts of every gradient word fail. Low-opacity "muted" gray body text (e.g. `text-white/50`) on dark also routinely lands at 2.5–3.5:1, below the 4.5:1 minimum for body text. Recruiters often view on bad laptop screens in bright offices — low contrast becomes literally unreadable.

**Why it happens:**
Dark + neon gradient *looks* high-contrast and punchy on a calibrated monitor, so contrast is never measured. Tailwind's `/opacity` modifiers make it trivial to dial text too faint.

**How to avoid:**
- Reserve the gradient for **large display headings only** (≥24px bold, where WCAG threshold is 3:1) and ensure the *lightest-failing point* of the gradient still clears 3:1 against the actual background. The blue/cyan end is safer than violet — orient gradients so text-critical areas use the brighter stops.
- Body text: use solid near-white (`#E5E7EB`/`#F3F4F6`), never gradient, never below `white/70`. Verify 4.5:1.
- Run an automated contrast pass (axe DevTools, Lighthouse Accessibility, or WebAIM contrast checker) on every text color × background pairing including hover states.
- Never put body-size gradient text or place text directly on top of the moving gradient blob.

**Warning signs:**
Lighthouse Accessibility < 100 flagging "contrast"; squinting to read secondary text; gradient words where one end "disappears" into the background.

**Phase to address:**
Design-system/foundation phase (lock accessible color tokens before building sections). Audit in accessibility/polish phase.

---

### Pitfall 3: No `prefers-reduced-motion` support

**What goes wrong:**
The site is wall-to-wall scroll-triggered reveals, parallax, gradient motion, and hover transforms. For users with vestibular disorders, motion sickness, or migraine triggers, this is at best nauseating and at worst inaccessible — and `prefers-reduced-motion` is an explicit WCAG 2.1 success criterion (2.3.3). It's also an easy automated/manual flag. A recruiter or accessibility-conscious eng manager who has reduced-motion on at the OS level will see a janky or overwhelming experience.

**Why it happens:**
Developers don't have reduced-motion enabled themselves, so they never see the degraded path. Framer Motion does **not** respect it by default unless configured.

**How to avoid:**
- Set Framer Motion's `MotionConfig reducedMotion="user"` at the app root. This auto-disables transform/layout animations while preserving opacity/color fades for users who request reduced motion.
- For CSS animations, wrap them in `@media (prefers-reduced-motion: no-preference)` or globally kill them with a `@media (prefers-reduced-motion: reduce)` reset (`animation: none; transition: none;`).
- Ensure that with motion reduced, content still *appears* (don't leave elements stuck at `opacity: 0` because the reveal never fired — this is the #1 reduced-motion bug: content becomes permanently invisible).
- Test by enabling Reduce Motion in macOS/Windows accessibility settings and reloading.

**Warning signs:**
Toggling OS "Reduce Motion" changes nothing; or worse, sections go blank because scroll-reveal opacity never animates in.

**Phase to address:**
Animation-infrastructure phase (set `MotionConfig` once, globally — cheap if done early, tedious retrofit if scattered).

---

### Pitfall 4: Over-design buries the signal recruiters need

**What goes wrong:**
The site optimizes for "wow" over "what did this person actually build." The recruiter spends their 15 seconds watching animations and decoding a clever non-linear layout instead of reading: *what you built, your role, the metrics, and how to contact you.* Key facts (30k+ plays, founding dev, RoboCup) are hidden behind hover states, scroll-jacking, or "scroll to reveal" gates. The games→fintech→robots arc is a vibe instead of three legible project cards.

**Why it happens:**
The project is fun to build as a design playground; the builder optimizes for their own aesthetic taste, not for a time-pressured stranger skimming on a phone between meetings.

**How to avoid:**
- Apply the "blink test": within ~5 seconds of landing, can a stranger state who you are, what you've shipped, and one concrete metric? Test on a real person who isn't you.
- Lead the hero with a plain-language one-liner ("CompE @ UIUC building games, fintech, and robots") — bold typography, not buried meaning.
- Each project card must surface role + metric + stack **above the fold of the card**, no hover required (hover-only info is invisible on mobile/touch entirely — see Pitfall 8).
- No scroll-jacking / hijacked scroll speed. Recruiters bail on disorientation.
- Keep total scan path linear and short. Resume PDF and contact reachable within one action from the top.

**Warning signs:**
A test viewer can't recall a single concrete accomplishment after viewing; key metrics only appear on hover; you can't get to contact/resume without a long scroll.

**Phase to address:**
Content/IA phase and each section-build phase (content hierarchy is a per-section discipline, not a one-time fix).

---

### Pitfall 5: Clash Display FOUT/FOIT (non-Google font loading)

**What goes wrong:**
Clash Display is from Fontshare (not Google Fonts), so it can't use the zero-config `next/font/google` path. Naively imported via a CSS `@import` from Fontshare's CDN or a raw `@font-face`, it causes either FOIT (invisible headings until the font downloads — terrible for a heading-driven hero) or FOUT with a large layout shift as Clash Display swaps in and reflows the hero (hurts CLS). On slow mobile the bold hero headline is blank or jumps for hundreds of ms.

**Why it happens:**
The `next/font` optimization is associated with Google fonts; people don't realize `next/font/local` gives the same self-hosting + zero-layout-shift benefits for any font, and instead drop in a CDN `<link>`/`@import` that defeats it.

**How to avoid:**
- Download the Clash Display `.woff2` (specific weights only — likely just one or two; don't ship the variable+all static weights) and self-host via `next/font/local`.
- Configure `display: 'swap'`, a `fallback` stack, and `adjustFontFallback`/size-adjusted fallback metrics so the fallback occupies the same space — eliminates layout shift (CLS) on swap.
- `next/font` auto-self-hosts and preloads at build time with immutable cache headers; do **not** also load it from Fontshare's CDN.
- Subset to Latin and only the glyphs/weights used.

**Warning signs:**
Hero heading is blank then pops in; visible reflow/jump when fonts load; CLS > 0.1 in Lighthouse; network tab shows a request to `api.fontshare.com` or `@import` at runtime.

**Phase to address:**
Design-system/foundation phase (font pipeline set up before any heading is rendered).

---

### Pitfall 6: Visible focus states destroyed by custom dark styling

**What goes wrong:**
To make buttons/links look clean, the global CSS nukes outlines (`*:focus { outline: none }` or Tailwind's reset is overridden) without providing a replacement. Keyboard users (and screen-reader users) can't see where they are — a WCAG 2.4.7 failure and a strong negative signal to any accessibility-aware engineering manager. On a dark theme with subtle hover styling, default browser focus rings are also often invisible against the background.

**Why it happens:**
Default focus rings look "ugly" against the bold design, so they get removed. The keyboard path is never tested because everyone navigates with a mouse.

**How to avoid:**
- Never remove focus indicators globally. Use `:focus-visible` with a high-contrast custom ring (e.g. a cyan/white ring with offset) that's visible on the dark background and on top of gradient surfaces.
- Tab through the entire site: every link, button, the resume download, and contact links must show a clearly visible focus state in logical order.
- Ensure interactive elements are real `<a>`/`<button>` (not animated `<div>`s) so they're focusable and keyboard-activatable at all.

**Warning signs:**
Tabbing shows no visible indicator, or focus "disappears" on certain sections; interactive elements built as `<div onClick>`.

**Phase to address:**
Animation/component-infrastructure phase (shared button/link components own focus styling once). Audit in accessibility phase.

---

### Pitfall 7: SEO/social metadata missing — link previews look broken

**What goes wrong:**
The site ships with the default Next.js `<title>` ("Create Next App") or just "Home", no meta description, and **no Open Graph image**. When the recruiter pastes the URL into Slack/LinkedIn/iMessage/email, it renders a blank or ugly preview with no name, no title, no thumbnail. For a *personal brand* site whose entire job is being shared and remembered, this silently undercuts every share.

**Why it happens:**
Metadata isn't visible on the page itself, so it's never noticed during dev. OG images especially are an "I'll do it later" that never happens.

**How to avoid:**
- Use Next.js App Router `metadata` export: descriptive `title` ("Jacky Zhang — Computer Engineer & Builder"), `description`, `openGraph`, and `twitter` card fields.
- Add a real OG image (1200×630) — either a designed static image or generated via `next/og` / `opengraph-image.tsx`. Make it on-brand (gradient + name + tagline).
- Set `metadataBase`, favicon/app icons, and `lang="en"` on `<html>`.
- Validate with the LinkedIn Post Inspector / opengraph.xyz before sharing.

**Warning signs:**
Pasting the URL anywhere shows no thumbnail or wrong title; browser tab says "Create Next App"; view-source shows no `og:` tags.

**Phase to address:**
Pre-launch/deployment phase (but the `metadata` scaffold is cheap to stub early in foundation).

---

### Pitfall 8: Mobile breakage — touch, hover-only content, and oversized type

**What goes wrong:**
Recruiters frequently open links on their phones. Common failures: (a) interactions/info that only exist on `:hover` are invisible/inaccessible on touch; (b) the dramatic Clash Display hero sized in `vw`/huge fixed px overflows horizontally and causes a horizontal scrollbar; (c) gradient blobs / `position: fixed` decorative elements overflow `body` and create side-scroll; (d) tap targets (icon links, nav) are smaller than 44px; (e) scroll animations stutter on mobile GPUs.

**Why it happens:**
The whole thing is built and demoed at desktop width. Mobile is an afterthought checked once at the end, by which time layout assumptions are baked in.

**How to avoid:**
- Build mobile-first (Tailwind's default), test at 360–390px width continuously, not at the end.
- No information that only appears on hover — surface project metrics/role inline. Use tap-to-expand if needed.
- Use clamp()-based fluid type for the hero so it scales down without overflow; set `overflow-x: hidden` defensively and constrain decorative absolutely-positioned elements.
- Ensure tap targets ≥44×44px (resume download, social icons, nav).
- Test real scroll performance on an actual phone, not just devtools responsive mode.

**Warning signs:**
Horizontal scrollbar on mobile; hero text clipped/overflowing; can't trigger something on a phone that works on hover; tiny tappable icons.

**Phase to address:**
Every section-build phase (responsive is per-component). Dedicated cross-device QA in the polish/launch phase.

---

### Pitfall 9: Broken, missing, or placeholder links and assets

**What goes wrong:**
The single highest-stakes interactions on a recruiting site are: **the resume PDF download, the email link, and the GitHub link.** Classic failures: resume links to a 404 or an outdated PDF; `mailto:` has a typo; GitHub points to a profile with no/empty repos; project "Live demo"/"GitHub" buttons are `href="#"` placeholders left from the template. A recruiter who clicks "Resume" and gets a 404 forms an instant "doesn't ship finished work" impression — the exact opposite of the site's goal.

**Why it happens:**
Links are stubbed during build with placeholders and the "wire up real URLs" task gets lost. PDFs in `/public` aren't validated after deploy. No automated link checking on a static site.

**How to avoid:**
- Maintain an explicit checklist of every outbound link + asset; verify each on the **deployed Vercel URL**, not just localhost (case-sensitivity and `/public` paths can differ).
- Resume PDF: confirm it loads, is current, opens in a new tab, and the filename is professional (`Jacky-Zhang-Resume.pdf`).
- No `href="#"` or `href=""` survivors. Every project's demo/repo link either works or is removed.
- Run a link checker (e.g. `linkinator`/`lychee`) against the built site or the live URL pre-launch.

**Warning signs:**
Any `#` href in the codebase near launch; resume opens 404 on the live site; GitHub link goes to an empty profile.

**Phase to address:**
Content phase (wire real URLs as content lands) + mandatory pre-launch verification phase on the live URL.

---

### Pitfall 10: Vague project descriptions with no role, metrics, or outcome

**What goes wrong:**
Project cards read "A Roblox game I made" or "A fintech app" — adjectives, not evidence. The recruiter can't distinguish a weekend toy from 30k+ plays. The single biggest credibility lever (concrete numbers and *your specific role*) is absent, which is ironic because the raw material (30k plays, 100+ concurrent, founding dev, Team Canada) is genuinely strong.

**Why it happens:**
Writing crisp accomplishment copy is harder and less fun than building animations, so it's left as Lorem-ipsum-grade filler and never tightened. The builder is too close to the work to know which facts are impressive to outsiders.

**How to avoid:**
- Every project card states: **what it is (1 line) → your role → a concrete metric → the stack.** E.g. "Roblox game — solo dev. 30k+ plays, 100+ concurrent peak. Lua." 
- Lead with the number. Use the JetBrains Mono label style to make metrics visually pop as data.
- Cut hedging ("helped with," "worked on") — state ownership precisely and truthfully.
- Have someone unfamiliar read each card and report what they think you did; fix gaps.

**Warning signs:**
Project copy contains no numbers; can't tell the builder's role; descriptions are interchangeable adjectives.

**Phase to address:**
Content/projects phase. This is content work, not a layout fix — budget real time for copy.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Load Clash Display via Fontshare CDN `@import` | Works in 1 line | FOUT/CLS, extra network round-trip, no build-time preload | Never for production — use `next/font/local` |
| Animate hero/LCP element opacity from 0 | Looks dramatic | Direct LCP regression, low mobile Lighthouse | Never on the LCP element; fine on secondary elements |
| `outline: none` globally to clean up focus rings | Tidy visuals | WCAG 2.4.7 failure, unusable for keyboard users | Never without a `:focus-visible` replacement |
| Hover-only project details | Cleaner cards on desktop | Invisible on mobile/touch, hides key signal | Never for must-read info; OK for purely decorative flourish |
| Skip OG image / metadata "for now" | Faster to first deploy | Broken share previews undermine the whole brand site | Acceptable only pre-launch; must exist before sharing |
| Ship all Clash Display weights + variable font | Don't have to decide weights | Large font payload, slower load | Only if genuinely using many weights — usually subset to 1–2 |
| Scroll-jacking / custom scroll speed for "premium" feel | Feels fancy | Disorients recruiters, accessibility + motion-sickness issues | Effectively never for this audience |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Fontshare (Clash Display) | Runtime CDN `@import`/`<link>` | Self-host `.woff2` via `next/font/local`, subset + size-adjust fallback |
| Vercel deploy | Assuming localhost case-insensitivity holds (macOS) → broken image/asset paths on Vercel's case-sensitive Linux | Match filename casing exactly; verify all `/public` assets on the live URL |
| Vercel + custom domain | Sharing/printing the `*.vercel.app` URL; HTTPS/`www` redirect not set | Attach a custom domain (or clean vercel subdomain), confirm canonical redirect + HTTPS |
| Framer Motion | Not setting `reducedMotion`; importing full bundle eagerly | `MotionConfig reducedMotion="user"`; `LazyMotion` to defer bundle |
| `mailto:`/GitHub links | Typos, empty profile, `target` without `rel="noopener"` | Verify destinations on live site; add `rel="noopener noreferrer"` on `target="_blank"` |
| Resume PDF in `/public` | Stale file, 404 path, generic filename | Validate on live URL, professional filename, opens in new tab |

## Performance Traps

"Scale" = throttled mobile devices and slow networks, not concurrency.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Animating LCP hero element | LCP 3s+, mobile Perf < 80 | Render LCP at full opacity; animate secondary/CSS-only | Always on throttled mobile |
| Unoptimized hero/project images | Slow LCP, large transfer | `next/image`, WebP/AVIF, correct `sizes`, lazy below-fold | Every mobile/slow-network visit |
| Eager full Framer Motion bundle | JS blocks first paint 200–400ms on mobile | `LazyMotion` + `domAnimation`; CSS for simple cases | Mid-range Android, p75 mobile |
| Many simultaneous scroll-reveals / parallax | Jank, low FPS, dropped frames | Animate only `transform`/`opacity` (compositor); limit concurrent; `will-change` sparingly | Low-end GPUs, long pages |
| Large animated gradient (big blur/filter) | Repaint cost, scroll jank | Use CSS gradient on a fixed layer, avoid animating `filter: blur`; prefer pre-rendered | Mobile GPUs |
| Shipping all font weights | Larger payload, slower swap | Subset to used weights/glyphs | Slow networks |

## Security Mistakes

Minimal surface (static, no backend, no auth), but still:

| Mistake | Risk | Prevention |
|---------|------|------------|
| `target="_blank"` without `rel="noopener noreferrer"` | Reverse tabnabbing, referrer leak | Add `rel="noopener noreferrer"` to all external/new-tab links |
| Exposing personal email as raw text to scrapers | Spam to primary inbox | Use a dedicated/aliased contact email; consider obfuscation or a mailto with a purpose-built address |
| Committing analytics keys / private data to public repo | Leakage | Use Vercel env vars; keep the repo clean (it may itself be a recruiting artifact — keep it tidy) |
| Missing security headers | Minor, but free win | Add basic headers (`X-Content-Type-Options`, referrer-policy) via `next.config`/Vercel |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Wow-first, signal-buried hero | Recruiter leaves without learning what you built | One-line plain identity statement up top; metrics visible immediately |
| Hover-gated project info | Mobile/touch users see nothing | Surface role + metric inline, no hover required |
| Scroll-jacking / unexpected scroll speed | Disorientation, bounce | Native scroll; reveal on scroll without hijacking it |
| Contact/resume far down a long animated page | High-intent recruiter can't act quickly | Persistent nav or top-level CTA to resume + contact |
| Auto-playing heavy motion with no rest | Overwhelm, motion sickness | Respect reduced-motion; keep idle states calm |
| Gradient text everywhere | Reads as noise, hurts legibility | Reserve gradient for one or two hero accents |

## "Looks Done But Isn't" Checklist

- [ ] **Resume download:** Often 404s or is stale on the live site — verify it loads current PDF from the deployed Vercel URL, opens in new tab.
- [ ] **Link previews:** Often missing OG image/title — paste the live URL into LinkedIn/Slack and confirm a branded preview renders.
- [ ] **Mobile hero:** Often overflows — check at 360px width for horizontal scroll and clipped Clash Display text.
- [ ] **Reduced motion:** Often unhandled — enable OS Reduce Motion and confirm content still appears and motion calms.
- [ ] **Keyboard nav:** Often has invisible focus — Tab through every interactive element and confirm a visible focus ring.
- [ ] **Contrast:** Often fails on muted text/gradient — run Lighthouse Accessibility = 100 and a contrast checker on each pairing.
- [ ] **Placeholder links:** Often `href="#"` survivors — grep the codebase; every demo/repo link works or is removed.
- [ ] **Metadata/title:** Often "Create Next App" — confirm real `<title>`, description, favicon, `lang`.
- [ ] **Project metrics:** Often vague — every card shows role + a concrete number.
- [ ] **Font loading:** Often FOUT/CLS — confirm no runtime Fontshare request, CLS < 0.1, no heading reflow.
- [ ] **Lighthouse mobile:** Often only tested on desktop — run mobile-throttled Perf ≥ 90, LCP < 2.5s.
- [ ] **Case-sensitive assets:** Often break only on Vercel — confirm all images/fonts load on the live Linux deploy.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| LCP-animated hero | LOW–MEDIUM | Set hero text to opacity 1 on paint; move entrance to secondary elements/CSS; re-run Lighthouse |
| Contrast failures | LOW | Swap to accessible solid tokens; reorient/limit gradient text; re-audit |
| No reduced-motion | LOW | Add `MotionConfig reducedMotion="user"` + CSS media query reset globally |
| Clash Display FOUT/CLS | MEDIUM | Migrate to `next/font/local`, subset, add size-adjust fallback |
| Missing OG/metadata | LOW | Add `metadata` export + `opengraph-image.tsx`; revalidate with inspector |
| Mobile overflow | MEDIUM | Fluid `clamp()` type, constrain absolute decor, `overflow-x: hidden`, re-test |
| Broken resume/links | LOW | Fix URLs/asset paths, verify on live site, add link checker |
| Over-design burying signal | MEDIUM–HIGH | Rewrite content hierarchy, de-gate hover info, simplify — may touch many sections |
| Vague project copy | LOW–MEDIUM | Rewrite each card to role + metric + stack; external read-back |
| Missing focus states | LOW | Add `:focus-visible` ring to shared components |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Clash Display FOUT/CLS (#5) | Foundation / design-system | No runtime Fontshare request; CLS < 0.1 |
| Dark + gradient contrast (#2) | Foundation (color tokens) | Lighthouse A11y = 100; contrast checker pass |
| Reduced-motion missing (#3) | Animation infrastructure | OS Reduce Motion → content visible, motion calmed |
| Focus states removed (#6) | Component/animation infrastructure | Tab-through shows visible focus everywhere |
| LCP-animated hero (#1) | Hero/landing build | Mobile LCP < 2.5s; Perf ≥ 90 |
| Over-design buries signal (#4) | Content/IA + each section | 5-second blink test with a real stranger |
| Mobile breakage (#8) | Each section + launch QA | No horizontal scroll at 360px; touch parity |
| Vague project copy (#10) | Content/projects | Every card has role + concrete metric |
| SEO/OG metadata (#7) | Pre-launch/deploy | Branded link preview on LinkedIn/Slack |
| Broken links/resume (#9) | Content + pre-launch verification | Link checker + manual check on live URL |

## Sources

- Next.js font optimization & `next/font/local` (display swap, `adjustFontFallback`, size-adjust, build-time preload) — Next.js docs, LogRocket, Contentful guides — HIGH
- Framer/Motion Lighthouse + LCP impact (opacity-from-0 distorting LCP heuristic; ~20ms desktop vs 200–400ms throttled mobile JS; `LazyMotion`) — Framer Help, motion.dev accessibility docs, DEV/OnlyFrontendJobs writeups, GoogleChrome/lighthouse issues #10833 / #10869 — HIGH
- Motion React accessibility / `MotionConfig reducedMotion="user"` (preserves opacity/color, disables transform/layout) — motion.dev/docs/react-accessibility, Framer reduced-motion settings — HIGH
- WCAG 2.1: 1.4.3 contrast (4.5:1 text / 3:1 large text), 2.3.3 animation from interactions, 2.4.7 focus visible — W3C — HIGH
- Vercel case-sensitive Linux build asset gotcha, `rel="noopener"` for `target="_blank"` — general web platform knowledge — HIGH
- Recruiter-scan UX (blink test, metrics-forward project copy) — portfolio review consensus / domain experience — MEDIUM

---
*Pitfalls research for: bold animated dark recruiting portfolio (Next.js/Tailwind/Framer Motion/Vercel)*
*Researched: 2026-06-29*
