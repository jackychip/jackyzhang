# Feature Research

**Domain:** Recruiting-focused developer/engineering-student portfolio (single-page static site)
**Researched:** 2026-06-29
**Confidence:** HIGH

## Context Anchor

Audience is tech recruiters and engineering hiring managers screening for internship candidates. Two distinct viewers with different time budgets:

- **Recruiter (non-technical):** ~5–15 second skim, often on mobile. Wants to answer "Is this person a serious, employable builder?" Scans for role/identity, recognizable signals (company names, big numbers, schools), and a resume to forward.
- **Hiring manager / engineer (technical):** 1–3 minutes if the skim passed. Wants depth: what did you actually build, what was the hard part, does the code/decision-making hold up.

Every feature below is graded on whether it moves one of these two viewers toward "interview this person." The owner's real differentiator is **range with proof**: Roblox games (30k+ plays, 100+ concurrent), founding dev at a stealth fintech startup, Team Canada RoboCup robotics, and an EV parking case study. The site must make that range legible fast, because "multi-domain builder who ships" is a stronger story than any single project.

## Feature Landscape

### Table Stakes (Recruiters Expect These)

Missing any of these and a recruiter bounces or quietly downgrades the candidate. No credit for having them; heavy penalty for missing.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Hero that states identity in 5 seconds** | Recruiters spend ~3–15s on first impression; if they can't tell who you are and what you do, they leave | LOW | Must include: name, "Computer Engineering @ UIUC", a one-line positioning of the builder arc (games → fintech → robots), and a primary CTA. Avoid vague taglines ("passionate developer"); be specific and concrete |
| **Above-the-fold CTAs: View Resume + Contact** | The recruiter's job is to forward a resume and reach out; make both reachable without scrolling | LOW | Resume button + email/contact visible in hero or sticky nav. Do not bury behind scrolling |
| **Projects section with 4 featured projects** | Proof of "ships real things." A portfolio with no concrete work is just a styled resume | MEDIUM | Games, fintech MVP, robotics, EV study. 2–5 strong projects beats 10 weak ones — owner already has exactly the right count |
| **Quantified metrics on project cards** | Numbers are the fastest credibility signal a recruiter can parse. "30k+ plays, 100+ concurrent" reads instantly | LOW | Surface a headline metric per project as a visual stat, not buried prose. See Project Card spec below |
| **Tech stack tags per project** | Hiring managers keyword-match against the role; recruiters pattern-match against the req | LOW | Short tag chips (React Native, Firebase, Lua, C++, Python). Mirror the language of internship JDs |
| **Downloadable resume PDF** | The single artifact a recruiter actually forwards internally; the conversion action of the whole site | LOW | Open in new tab + download. Host as a versioned static asset. Filename should be human (`Jacky-Zhang-Resume.pdf`), not `resume-final-v3.pdf` |
| **Working contact: email + GitHub (+ LinkedIn)** | Recruiters need a one-click way to reach out and to verify you exist professionally | LOW | `mailto:` link, GitHub, LinkedIn. LinkedIn is near-mandatory for recruiter workflows even though not in the original section list — strongly recommend adding |
| **Mobile responsive** | ~60–68% of initial portfolio views are mobile; recruiters screen on phones between meetings | MEDIUM | Hero, project cards, and resume button must all work one-handed on a phone. Test the gradient/dark theme for legibility on small screens |
| **Fast load (< 3s, ideally < 1.5s)** | A slow or janky site signals weak engineering judgment; recruiters won't wait | MEDIUM | Next.js static export on Vercel covers most of this. Watch font loading (Clash Display), image weight, and Framer Motion not blocking first paint |
| **No broken links / no dead demos** | A broken link or 404 demo is an instant red flag and reads as carelessness | LOW | Every project link, resume link, and social link must resolve. Treat as a launch gate |
| **Clear visual hierarchy + navigation** | Recruiters judge "coherence and control" visually in seconds; clutter reads as inability to prioritize | MEDIUM | Skimmable sections, obvious order, anchor nav. The bold/dark founder aesthetic helps only if hierarchy is clean |
| **Professional URL** | An unprofessional or temp URL undercuts everything else | LOW | Custom domain (e.g. `jackyzhang.dev`) over `*.vercel.app`. Cheap, high signal |

### Differentiators (What Makes This Student Stand Out)

Not expected, but they convert skeptics into "we should talk." These are where the owner's actual profile wins.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **The "range" narrative, made explicit** | Most student portfolios show 3 variations of the same CRUD app. Games + fintech + robotics + EV signals adaptability and real shipping across hard domains — a top 5% story | LOW | Lead the hero and About with the games → fintech → robots arc as a deliberate throughline, not a random list. This is the owner's single biggest edge |
| **"Founding developer at a stealth fintech startup" credibility line** | "Founding dev" + real product (React Native, Firebase) signals ownership and ambition far beyond coursework — exactly what hiring managers screen for | LOW | Front-load this. Stealth = can describe role, stack, and impact without naming the company. Frame around ownership and what was built |
| **Live/playable proof for the games** | A recruiter clicking through to a Roblox game with real concurrent players is unfakeable proof of shipping | LOW | Link directly to the live game(s). "30k+ plays" is good; "play it now" is better. Consider an embedded short gameplay clip/GIF |
| **Per-project mini case-study depth (for technical viewers)** | Gives the hiring manager the "what was hard / what did you decide" substance that separates real builders from tutorial-followers | MEDIUM | Expandable detail or a per-project page: problem → approach → result. Robotics (IR detection & navigation algorithms) and fintech are the strongest depth stories |
| **Team Canada RoboCup as a named credential** | "Team Canada" + international competition is a recognizable, hard-to-fake achievement that recruiters instantly weight | LOW | Treat like a brand/logo credibility signal, not just another project. Pair with a concrete technical contribution (IR detection, navigation) |
| **Experience timeline / resume-on-page** | Lets the recruiter get the resume signal without downloading the PDF; reduces friction in the 15s window | MEDIUM | Already a decided section. Mirror the PDF so on-page and downloaded stories match. Reverse-chronological, role + impact bullets |
| **Subtle, performant motion (Framer Motion)** | For an engineering portfolio, restrained polish signals craft and front-end competence; doubles as a skill demo | MEDIUM | Entrance/scroll reveals, hover states on cards. Must stay fast and never feel like a tech demo. Tasteful > flashy |
| **Skills/tech section mapped to real usage** | Lets recruiters keyword-match and shows breadth (Python, Java, C/C++, React Native, Lua, Firebase) | LOW | Group logically (languages / frameworks / tools). Tie skills back to where they were used to avoid "list of buzzwords" |
| **Resume kept in sync + dated** | A current resume signals an active, serious candidate; a stale one signals abandonment | LOW | Visible "updated [month/year]" builds trust; makes the PDF feel maintained |
| **Open Graph / link preview cards** | Recruiters share portfolios in Slack/email; a clean preview image + title increases click-through internally | LOW | OG image with name + tagline. Cheap, punches above its weight in recruiter workflows |

### Anti-Features (Seem Good, Hurt a Recruiting Site)

Things that look like value but add upkeep, slow the site, or distract from the 15-second conversion. Documented to prevent scope creep.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Blog / writing section** | "Thought leadership," SEO | Ongoing upkeep with no recruiting payoff; an empty or stale blog actively hurts ("last post 2 years ago") | Already out of scope — keep it out. Put energy into project depth instead |
| **Contact form with backend** | Feels professional | Adds a backend/spam surface to an otherwise static site; recruiters prefer to copy your email or hit `mailto:`/LinkedIn anyway. A broken form is worse than none | `mailto:` link + visible email + LinkedIn/GitHub. Zero backend |
| **CMS / admin dashboard** | "Easy to update" | Massive over-engineering for ~4 projects that change a few times a year; adds infra and failure modes | Static content in the codebase. Editing is a git commit — itself a recruiting signal |
| **Auth / user accounts / analytics gating** | "Track visitors," gated content | No logged-in functionality exists; gating content blocks the recruiter you want to reach | Public, frictionless. If you want traffic insight, use privacy-light Vercel/Plausible analytics passively |
| **Animated intro / preloader / splash screen** | Looks "premium" | Adds latency before the recruiter sees content in a 5s window; reads as style-over-substance to engineers | Render hero instantly; reserve motion for in-content reveals |
| **Heavy 3D / WebGL hero (e.g. Three.js scene)** | Wow factor | Hurts load time and mobile perf; can crowd out the identity message; high build cost for low recruiter payoff | A bold typographic hero + signature gradient achieves "founder energy" at a fraction of the cost |
| **Generic filler projects (to-do app, weather app, calculator)** | "More projects = stronger" | Recruiters have seen a thousand; dilutes the strong real projects and signals padding | Curate ruthlessly to the 4 real, differentiated projects. Quality over quantity |
| **Long autobiographical About essay** | "Tell my story" | Nobody reads a wall of text in 15s; buries the signal | Tight About: 2–4 sentences of narrative + the builder arc + a few human-interest hooks (rock climbing, robotics, frisbee) for memorability |
| **Testimonials / endorsements section** | Social proof | Hard to source credibly as a student; can read as filler or try-hard | Let named credentials (Team Canada, 30k+ plays, founding dev) be the proof |
| **Dark/light theme toggle** | "Nice to have" | Engineering cost and a second visual system to maintain for near-zero recruiter value; design is intentionally dark-first | Ship the locked dark-first design well. Skip the toggle |
| **Visitor chatbot / AI assistant** | Novelty | Gimmick that distracts from the resume-forward goal and risks breaking | Clear nav + a direct contact path |

## Feature Dependencies

```
[Hero: identity in 5s]
    └──requires──> [Positioning / builder-arc copy locked]
    └──requires──> [Primary CTAs: Resume + Contact]

[Project cards]
    └──requires──> [Per-project content: metric + stack + 1-line outcome]
                       └──enhances──> [Mini case-study depth (technical viewers)]

[Resume button] ──requires──> [Resume PDF as static asset]
[On-page experience timeline] ──must-sync-with──> [Resume PDF]

[Mobile responsive] ──gates──> [everything: 60%+ of views]
[Fast load] ──conflicts──> [3D hero / preloader / unoptimized media]

[OG preview cards] ──enhances──> [recruiter internal sharing]
[Live game links] ──enhances──> [Project cards: "30k plays" → "play it"]
```

### Dependency Notes

- **Hero requires locked positioning copy:** The 5-second message ("CompE student, founder-builder across games/fintech/robotics") must be written before the hero is meaningful. This is content work, not just layout — do it first.
- **Project cards require per-project content blocks:** Each card needs a headline metric, stack tags, and a one-line outcome. Gather these (especially fintech metrics that are shareable under stealth, and RoboCup technical contributions) before building the section.
- **Experience timeline must sync with the resume PDF:** Two sources of truth that disagree erode trust. Decide the canonical role/dates/impact once and mirror them.
- **Fast load conflicts with heavy hero media:** Any 3D/WebGL/preloader directly fights the < 3s table-stakes requirement and the mobile majority. Resolve in favor of speed.
- **Live game links enhance project cards:** The Roblox work uniquely supports clickable live proof — prioritize wiring those links since they convert better than a static number.

## MVP Definition

### Launch With (v1)

The recruiting site is itself the MVP — it should ship complete on the conversion path. "Minimum" here means no non-converting extras, not a half-built site.

- [ ] **Hero with identity + builder-arc one-liner + Resume/Contact CTAs** — the 5-second test; everything else is moot if this fails
- [ ] **4 project cards with headline metric + stack tags + one-line outcome** — proof of shipping across domains
- [ ] **Live links for the Roblox games** — unfakeable shipping proof
- [ ] **About section: tight builder narrative** — converts skim into a memorable story
- [ ] **Experience timeline + downloadable resume PDF (synced)** — the artifact recruiters forward
- [ ] **Contact: email (`mailto:`) + GitHub + LinkedIn** — the outreach path
- [ ] **Mobile responsive + < 3s load + zero broken links** — non-negotiable table stakes
- [ ] **Custom domain + OG preview image** — professional URL and shareable preview

### Add After Validation (v1.x)

Add once the core converts and the owner has time/content.

- [ ] **Per-project mini case studies (problem → approach → result)** — trigger: a hiring manager asks for more depth, or robotics/fintech stories are ready to write up
- [ ] **Embedded gameplay clip/GIF for games** — trigger: have a clean short capture; raises game-card conversion
- [ ] **Skills section mapped to projects** — trigger: applying to roles with specific keyword requirements
- [ ] **Passive privacy-light analytics** — trigger: want to know which projects recruiters click

### Future Consideration (v2+)

- [ ] **Standalone per-project deep-dive pages** — defer until there's a project worth a full write-up and an audience reading past the home page
- [ ] **Light/dark toggle or alternate themes** — defer indefinitely; low recruiter value, design is dark-first by decision

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero: identity in 5s + CTAs | HIGH | LOW | P1 |
| Project cards w/ metrics + stack tags | HIGH | MEDIUM | P1 |
| Downloadable resume PDF | HIGH | LOW | P1 |
| Contact: email + GitHub + LinkedIn | HIGH | LOW | P1 |
| Mobile responsive + fast load | HIGH | MEDIUM | P1 |
| No broken links (launch gate) | HIGH | LOW | P1 |
| Experience timeline (synced) | HIGH | MEDIUM | P1 |
| Live game links | HIGH | LOW | P1 |
| Custom domain + OG preview | MEDIUM | LOW | P1 |
| About / builder narrative | HIGH | LOW | P1 |
| Subtle Framer Motion polish | MEDIUM | MEDIUM | P2 |
| Per-project mini case studies | MEDIUM | MEDIUM | P2 |
| Skills section mapped to usage | MEDIUM | LOW | P2 |
| Gameplay clip/GIF embeds | MEDIUM | MEDIUM | P2 |
| Standalone project pages | LOW | HIGH | P3 |
| Theme toggle | LOW | MEDIUM | P3 |

## Project Card Spec (Reference for Requirements)

Each of the 4 cards should carry, in scan order:

1. **Title + domain tag** (Game / Fintech / Robotics / Research)
2. **Headline metric as a visual stat** — Games: `30k+ plays · 100+ concurrent`; Fintech: role + product framing ("Founding dev · React Native MVP"); Robotics: "Team Canada RoboCup 2024 · IR detection & navigation"; EV: "Parking case study · intern"
3. **One-line outcome** — what was built and why it mattered
4. **Stack tags** — keyword-matchable chips
5. **Primary link** — live game / repo / case study; live demo beats screenshots where it exists

Rationale: recruiters parse stats before prose; hiring managers read the stack and outcome. Ordering surfaces the strongest signal (the number/credential) first.

## Competitor Feature Analysis

| Feature | Typical student portfolio | Strong eng-student portfolio | Our Approach |
|---------|---------------------------|------------------------------|--------------|
| Hero | Generic "passionate developer" tagline | Specific role + niche positioning | Builder arc (games → fintech → robots) + CompE @ UIUC, concrete |
| Projects | 6–10 tutorial clones, no metrics | 3–5 real projects with quantified impact | 4 real, multi-domain projects, metric-forward |
| Proof | Screenshots only | Live demos + GitHub | Live Roblox games + repos + case-study depth |
| Resume | Sometimes missing or stale | Current, downloadable, synced | Downloadable PDF + synced on-page timeline, dated |
| Contact | Contact form (often broken) | Direct email + LinkedIn + GitHub | `mailto:` + GitHub + LinkedIn, no backend |
| Polish | Template default or over-animated | Restrained, fast, intentional | Bold dark founder aesthetic, performant Framer Motion |

## Sources

- [How Recruiters and Hiring Managers Actually Look at Your Portfolio — Opendoors Careers](https://blog.opendoorscareers.com/p/how-recruiters-and-hiring-managers-actually-look-at-your-portfolio) — MEDIUM
- [What Makes A Developer Portfolio Stand Out To Recruiters — Proxify](https://proxify.io/knowledge-base/job-descriptions/what-makes-a-developer-portfolio-stand-out-to-recruiters) — MEDIUM
- [How to Build a Developer Portfolio That Gets You Hired in 2026 — curious.page](https://curious.page/blog/how-to-build-developer-portfolio-gets-hired) — MEDIUM
- [What Hiring Managers Look for in Student Projects — TekCanon / Medium](https://medium.com/@tekcanon/what-hiring-managers-look-for-in-student-projects-for-tech-internships-entry-level-roles-19645e42353e) — MEDIUM
- [What I learned after reviewing 40+ developer portfolios — DEV Community](https://dev.to/kethmars/what-i-learned-after-reviewing-over-40-developer-portfolios-9-tips-for-a-better-portfolio-4me7) — MEDIUM
- [Selecting Projects for Your Portfolio: What Recruiters Look For — Nucamp](https://www.nucamp.co/blog/coding-bootcamp-job-hunting-selecting-projects-for-your-portfolio-what-recruiters-look-for) — MEDIUM
- [Software Engineering Portfolios: How to Make Them Shine — TripleTen](https://tripleten.com/blog/posts/software-engineering-portfolios-how-to-make-them-shine) — MEDIUM
- [Link Your Portfolio in the Resume the Right Way — Tiiny Host](https://tiiny.host/blog/link-portfolio-in-resume/) — LOW

---
*Feature research for: recruiting-focused engineering-student portfolio*
*Researched: 2026-06-29*
