import type { ReactNode } from "react";
import { withBasePath } from "@/lib/base-path";

/**
 * Section registry for the tiling-terminal workspace. Each entry is a pane the
 * visitor can "open" from the launcher; opening appends a terminal pane on the
 * right (see Workspace). Content is rendered as faux command output.
 *
 * NOTE: copy here is DRAFT/placeholder built from public CLAUDE.md facts —
 * final Revly metrics + About narrative are pending owner input (STATE blockers).
 */
export type SectionId = "about" | "experience" | "projects" | "contact";

export type SectionDef = {
  id: SectionId;
  /** Launcher label / command token, e.g. "./about". */
  command: string;
  /** Pane title-bar path, e.g. "~/about". */
  title: string;
  content: ReactNode;
};

const Echo = ({ children }: { children: ReactNode }) => (
  <p className="text-text-muted">
    <span className="text-cyan">visitor@jackyzhang</span>
    <span className="text-cyan">:~$</span> {children}
  </p>
);

const tLink =
  "text-text underline decoration-border underline-offset-4 transition-colors hover:decoration-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export const SECTIONS: SectionDef[] = [
  {
    id: "about",
    command: "./about",
    title: "~/about",
    content: (
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
  {
    id: "experience",
    command: "./experience",
    title: "~/experience",
    content: (
      <div className="space-y-3">
        <Echo>ls -la experience/</Echo>
        <ul className="space-y-3">
          <li>
            <p className="text-text">Revly — Founder &amp; Lead Engineer</p>
            <p className="text-text-muted">
              Live automotive-services marketplace. Built and shipped end to end.
            </p>
          </li>
          <li>
            <p className="text-text">Freelance — Full-stack Developer</p>
            <p className="text-text-muted">
              Client web apps, front to back.
            </p>
          </li>
          <li>
            <p className="text-text">
              Robotics — Team Canada RoboCup / ML Robotic Arm
            </p>
            <p className="text-text-muted">
              Competitive robotics + an ML-driven robotic arm.
            </p>
          </li>
          <li>
            <p className="text-text">Roblox — Game Developer</p>
            <p className="text-text-muted">Games played 40,000+ times.</p>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "projects",
    command: "./projects",
    title: "~/projects",
    content: (
      <div className="space-y-3">
        <Echo>ls projects/</Echo>
        <ul className="space-y-3">
          <li>
            <p className="text-text">revly/</p>
            <p className="text-text-muted">
              Live automotive-services marketplace — founder &amp; lead engineer.
            </p>
          </li>
          <li>
            <p className="text-text">robotic-arm/</p>
            <p className="text-text-muted">
              ML-driven robotic arm (perception → manipulation).
            </p>
          </li>
          <li>
            <p className="text-text">roblox-games/</p>
            <p className="text-text-muted">Shipped games, 40,000+ plays.</p>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "contact",
    command: "./contact",
    title: "~/contact",
    content: (
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
];
