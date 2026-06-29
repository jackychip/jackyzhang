import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";

/**
 * Home — composes the live, on-brand landing page (replaces the 01-01
 * walking-skeleton placeholder): a skip-to-content link (DSYS-04 a11y),
 * the sticky <Nav/>, and the LCP-safe <Hero/>. The Projects/About/Contact
 * sections that the nav + hero anchors target land in Phases 2–3; until then
 * those in-page anchors degrade gracefully (D-09).
 */
export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-md)] focus:bg-surface focus:px-4 focus:py-2 focus:font-sans focus:text-base focus:font-semibold focus:text-text focus:outline-2 focus:outline-offset-2 focus:outline-blue"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="flex flex-1 flex-col">
        <Hero />
      </main>
    </>
  );
}
