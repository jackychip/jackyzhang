import { Workspace } from "@/components/terminal/Workspace";

/**
 * Home — the tiling-terminal portfolio. A skip-to-content link (DSYS-04 a11y)
 * over the <Workspace/>: a pinned hero pane plus section panes the visitor
 * "opens" as tiled terminals that slide in from the right.
 *
 * (Prototype — replaces the 01-04 Nav + Hero scrolling composition. Interaction
 * direction pending owner sign-off before the content phases are replanned.
 * Nav.tsx / Hero.tsx / HeroIntro.tsx are retained, unused, for reference.)
 */
export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-md)] focus:bg-surface focus:px-4 focus:py-2 focus:font-sans focus:text-base focus:font-semibold focus:text-text focus:outline-2 focus:outline-offset-2 focus:outline-cyan"
      >
        Skip to content
      </a>
      <main id="main" className="flex flex-1 flex-col">
        <Workspace />
      </main>
    </>
  );
}
