import type { ReactNode } from "react";
import { withBasePath } from "@/lib/base-path";

/**
 * Node tree for the tiling-terminal workspace.
 *
 * Navigation is Miller-column style: the open panes form a PATH from the hero
 * (root). Opening a TOP_LEVEL section sets the first column (replacing any
 * sibling already there); opening a node's child appends the next column. Each
 * node may expose `children` — rendered as a clickable `ls` list that drills
 * one level deeper into a new pane.
 *
 * NOTE: copy is DRAFT/placeholder from public CLAUDE.md facts. Drill-down leaves
 * (revly, robotics, …) are intentionally thin — real detail + Revly metrics are
 * pending owner input (STATE blockers); can be backfilled from the resume.
 */
export type NodeId =
  | "about"
  | "experience"
  | "projects"
  | "contact"
  | "revly"
  | "freelance"
  | "robotics"
  | "roblox"
  | "robotic-arm"
  | "roblox-games";

export type TreeNode = {
  /** Path segment shown in the pane title, e.g. "experience", "revly". */
  name: string;
  /** Launcher / entry token, e.g. "./experience" or "revly/". */
  label: string;
  /** Static/placeholder pane body. */
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

const tLink =
  "text-text underline decoration-border underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const Soon = ({ children }: { children: ReactNode }) => (
  <p className="text-text-muted">
    {children} <span className="text-accent">// details coming soon</span>
  </p>
);

export const NODES: Record<NodeId, TreeNode> = {
  about: {
    name: "about",
    label: "./about",
    body: (
      <div className="space-y-3">
        <Echo>cat about.txt</Echo>
        <p className="text-text">
          Jacky Zhang — Computer Engineering @ UIUC (B.S. expected May 2029).
        </p>
        <p className="text-text-muted">
          Multi-domain builder: founder &amp; lead engineer of Revly (a live
          automotive-services marketplace), freelance full-stack developer,
          robotics programmer (Team Canada RoboCup + an ML-driven robotic arm),
          and a Roblox game developer with 40,000+ plays. I like shipping real
          things and proving them in production.
        </p>
      </div>
    ),
  },

  experience: {
    name: "experience",
    label: "./experience",
    body: (
      <p className="text-text-muted">
        Where I&apos;ve built and shipped. Open an entry for detail.
      </p>
    ),
    children: ["revly", "freelance", "robotics", "roblox"],
  },

  projects: {
    name: "projects",
    label: "./projects",
    body: (
      <p className="text-text-muted">
        Things I&apos;ve made. Open one to drill in.
      </p>
    ),
    children: ["revly", "robotic-arm", "roblox-games"],
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
            <dt className="w-16 shrink-0 text-text-muted">github</dt>
            <dd>
              <a
                className={tLink}
                href="https://github.com/jackychip"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/jackychip
              </a>
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

  // ── drill-down leaves (placeholder) ──────────────────────────────────────
  revly: {
    name: "revly",
    label: "revly/",
    body: (
      <div className="space-y-3">
        <Echo>cat revly/README.md</Echo>
        <p className="text-text">Revly — Founder &amp; Lead Engineer</p>
        <Soon>Live automotive-services marketplace.</Soon>
      </div>
    ),
  },
  freelance: {
    name: "freelance",
    label: "freelance/",
    body: (
      <div className="space-y-3">
        <Echo>cat freelance/README.md</Echo>
        <p className="text-text">Freelance — Full-stack Developer</p>
        <Soon>Client web apps, front to back.</Soon>
      </div>
    ),
  },
  robotics: {
    name: "robotics",
    label: "robotics/",
    body: (
      <div className="space-y-3">
        <Echo>cat robotics/README.md</Echo>
        <p className="text-text">Team Canada RoboCup · ML Robotic Arm</p>
        <Soon>Competitive robotics + ML-driven manipulation.</Soon>
      </div>
    ),
  },
  roblox: {
    name: "roblox",
    label: "roblox/",
    body: (
      <div className="space-y-3">
        <Echo>cat roblox/README.md</Echo>
        <p className="text-text">Roblox — Game Developer</p>
        <Soon>Games played 40,000+ times.</Soon>
      </div>
    ),
  },
  "robotic-arm": {
    name: "robotic-arm",
    label: "robotic-arm/",
    body: (
      <div className="space-y-3">
        <Echo>cat robotic-arm/README.md</Echo>
        <p className="text-text">ML-driven robotic arm</p>
        <Soon>Perception → manipulation.</Soon>
      </div>
    ),
  },
  "roblox-games": {
    name: "roblox-games",
    label: "roblox-games/",
    body: (
      <div className="space-y-3">
        <Echo>cat roblox-games/README.md</Echo>
        <p className="text-text">Shipped Roblox games</p>
        <Soon>40,000+ plays.</Soon>
      </div>
    ),
  },
};
