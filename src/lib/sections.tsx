import type { ReactNode } from "react";
import { withBasePath } from "@/lib/base-path";

/**
 * Node tree for the tiling-terminal workspace.
 *
 * Navigation is Miller-column style: open panes form a PATH from the hero.
 * Opening a TOP_LEVEL section sets column 1 (replacing a sibling); opening a
 * node's child appends the next column. Each node may expose `children` —
 * rendered as a clickable `ls` list that drills one level deeper.
 *
 * Content is sourced from the owner's resume (public/resume.pdf).
 */
export type NodeId =
  | "about"
  | "experience"
  | "projects"
  | "contact"
  | "revly"
  | "masongsong"
  | "robocup"
  | "so-101-arm"
  | "roblox";

export type TreeNode = {
  /** Path segment shown in the pane title, e.g. "experience", "revly". */
  name: string;
  /** Launcher / entry token, e.g. "./experience" or "revly/". */
  label: string;
  /** Pane body. */
  body?: ReactNode;
  /** Clickable sub-entries that open as the next column. */
  children?: NodeId[];
};

/** Sections reachable from the hero launcher (column 1). */
export const TOP_LEVEL: NodeId[] = [
  "about",
  "experience",
  "projects",
  "contact",
];

export const Echo = ({ children }: { children: ReactNode }) => (
  <p className="text-text-muted">
    <span className="text-accent">visitor@jackyzhang</span>
    <span className="text-accent">:~$</span> {children}
  </p>
);

const Title = ({ children }: { children: ReactNode }) => (
  <p className="font-semibold text-text">{children}</p>
);

const Meta = ({ children }: { children: ReactNode }) => (
  <p className="text-xs text-text-muted">{children}</p>
);

const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="space-y-1.5">
    {items.map((it, i) => (
      <li key={i} className="flex gap-2 text-text-muted">
        <span aria-hidden="true" className="text-accent">
          ▸
        </span>
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const Stack = ({ children }: { children: ReactNode }) => (
  <p className="text-text-muted">
    <span className="text-accent">stack</span> {children}
  </p>
);

const tLink =
  "text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const ExtLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a className={tLink} href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export const NODES: Record<NodeId, TreeNode> = {
  about: {
    name: "about",
    label: "./about",
    body: (
      <div className="space-y-3">
        <Echo>cat about.txt</Echo>
        <Title>Jacky Zhang</Title>
        <Meta>
          B.S. Computer Engineering · University of Illinois Urbana-Champaign ·
          expected May 2029 · Champaign, IL
        </Meta>
        <p className="text-text-muted">
          Multi-domain builder. Founder &amp; Lead Engineer of Revly (a live
          Canadian automotive-services marketplace), freelance full-stack
          developer, Lead Programmer for Team Canada at the RoboCup Soccer World
          Championships, and a robotics + Roblox builder. I like shipping real
          things and proving them in production.
        </p>
        <p className="text-xs text-text-muted/70">
          ↳ open ./experience or ./projects for detail →
        </p>
      </div>
    ),
  },

  experience: {
    name: "experience",
    label: "./experience",
    body: (
      <p className="text-text-muted">
        Roles where I&apos;ve built and shipped. Open an entry for detail.
      </p>
    ),
    children: ["revly", "masongsong", "robocup"],
  },

  projects: {
    name: "projects",
    label: "./projects",
    body: (
      <p className="text-text-muted">
        Things I&apos;ve made. Open one to drill in.
      </p>
    ),
    children: ["so-101-arm", "roblox"],
  },

  contact: {
    name: "contact",
    label: "./contact",
    body: (
      <div className="space-y-3">
        <Echo>./contact --all</Echo>
        <dl className="space-y-2">
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-text-muted">email</dt>
            <dd>
              <a className={tLink} href="mailto:jackyz4@illinois.edu">
                jackyz4@illinois.edu
              </a>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-text-muted">phone</dt>
            <dd>
              <a className={tLink} href="tel:+12178003165">
                (217) 800-3165
              </a>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-text-muted">github</dt>
            <dd>
              <ExtLink href="https://github.com/jackychip">
                github.com/jackychip
              </ExtLink>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-text-muted">resume</dt>
            <dd>
              <a className={tLink} href={withBasePath("/resume.pdf")} download>
                ./resume.pdf
              </a>
            </dd>
          </div>
        </dl>
      </div>
    ),
  },

  // ── experience leaves ─────────────────────────────────────────────────────
  revly: {
    name: "revly",
    label: "revly/",
    body: (
      <div className="space-y-3">
        <Echo>cat experience/revly.md</Echo>
        <Title>Revly — Founder &amp; Lead Engineer</Title>
        <Meta>
          Nov 2025 – Present · Ontario, Canada ·{" "}
          <ExtLink href="https://revly.ca/">revly.ca</ExtLink>
        </Meta>
        <Bullets
          items={[
            "Building a Canadian mobile marketplace connecting vehicle owners with local automotive service providers (detailing, roadside assistance, tire services) across Ontario.",
            "Architected a full-stack mobile app from scratch: Flutter/Dart frontend, FastAPI backend, Supabase for database/auth/realtime, Stripe payments, and FCM push notifications.",
          ]}
        />
        <Stack>Flutter · Dart · Python · FastAPI · Supabase · Firebase · Stripe</Stack>
      </div>
    ),
  },
  masongsong: {
    name: "masongsong",
    label: "masongsong/",
    body: (
      <div className="space-y-3">
        <Echo>cat experience/masongsong.md</Echo>
        <Title>Masongsong Engineering Ltd. — Freelance Software Developer</Title>
        <Meta>May 2026 – Present · Markham, ON</Meta>
        <Bullets
          items={[
            "Built a full-stack timesheet and progress-billing application from scratch to replace a firm's legacy Microsoft Access system — 12 end-to-end feature phases across two milestones (timesheet entry, approval workflow, admin CRUD, invoice lifecycle, financial reporting).",
            'Designed a progress-billing invoice engine supporting four cost-type calculations (fixed fee, upset limit, cost-of-work %, per-unit), with carry-over, cross-job "bill-with" aggregation, and a full create → finalize → PDF → correct lifecycle that reconciles to the dollar.',
          ]}
        />
        <Stack>
          Next.js 14 · TypeScript · Supabase (Postgres + Auth + Storage + RLS) ·
          Prisma · Tailwind/shadcn · react-pdf · Vitest/Playwright · Vercel
        </Stack>
      </div>
    ),
  },
  robocup: {
    name: "robocup",
    label: "robocup/",
    body: (
      <div className="space-y-3">
        <Echo>cat experience/robocup.md</Echo>
        <Title>Team Canada — RoboCup Soccer World Championships</Title>
        <Meta>Lead Programmer · July 2025 · Salvador, Brazil</Meta>
        <Bullets
          items={[
            "Selected as 1 of 8 students nationwide to represent Canada at the RoboCup Soccer World Championships in Salvador, Brazil.",
            "Engineered autonomous IR-based ball detection and pursuit algorithms enabling real-time positional tracking and navigation without human input.",
            "Optimized loop logic, sensor polling, and redundant calculations to improve execution speed by ~40% and cut memory usage by ~30%, meeting real-time performance requirements during competition.",
          ]}
        />
      </div>
    ),
  },

  // ── project leaves ────────────────────────────────────────────────────────
  "so-101-arm": {
    name: "so-101-arm",
    label: "so-101-arm/",
    body: (
      <div className="space-y-3">
        <Echo>cat projects/so-101-arm.md</Echo>
        <Title>SO-101 Robotic Arm</Title>
        <Meta>2025 – Present</Meta>
        <Bullets
          items={[
            "Assembled and configured a 6-DOF robotic arm: hardware bring-up, WSL2 environment setup, and teleoperation.",
            "Trained an ACT (Action Chunking with Transformers) imitation-learning model using the LeRobot framework on dual RTX 3080 GPUs.",
          ]}
        />
      </div>
    ),
  },
  roblox: {
    name: "roblox",
    label: "roblox/",
    body: (
      <div className="space-y-3">
        <Echo>cat projects/roblox.md</Echo>
        <Title>Roblox Game Development</Title>
        <Meta>Sept 2022 – Present</Meta>
        <Bullets
          items={[
            "Designed and shipped multiple Lua-scripted games accumulating 40,000+ total plays and 100+ peak CCU across titles.",
            "Co-managed a competitive community of 200+ active players, organizing matches and live events.",
          ]}
        />
      </div>
    ),
  },
};
