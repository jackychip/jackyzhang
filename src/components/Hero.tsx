import { Section } from "@/components/ui/Section";
import { HeroIntro } from "@/components/HeroIntro";

/**
 * Hero — the LCP-safe typographic hero (HERO-01/02/03, D-01..D-05).
 *
 * HARD RULE (HERO-03 / Pitfall 3): this is a Server Component that imports
 * NOTHING from the animation library (intentionally no such import in this
 * file). The gradient `<h1>` "Jacky Zhang" is the LCP element — it renders
 * statically at full opacity, never animated and never given an
 * `initial={{opacity:0}}`. Because the fill is `text-transparent`, fading it
 * from 0 would make the name literally invisible on first paint.
 *
 * Only the kicker / sub-headline / CTA group (in the client <HeroIntro/>)
 * animates — the static name is never gated behind that entrance.
 *
 * Layout (D-05): centered single column, vertically centered in `min-h-[100svh]`
 * (small-viewport height avoids the mobile URL-bar jump). One decorative ambient
 * radial glow (D-04, opacity ≤ 0.18) sits behind the content; its
 * prefers-reduced a11y guard already lives in globals.css
 * (`.ambient-glow { animation: none }`).
 */
export function Hero() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden">
      {/* D-04 — single decorative ambient glow, low opacity, behind the content. */}
      <div
        aria-hidden="true"
        className="ambient-glow pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-3xl [background:radial-gradient(circle,var(--color-violet),transparent_70%)]"
      />

      <Section className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* D-01 — the gradient LCP headline. STATIC. No animation. Full opacity. */}
        <h1 className="bg-gradient-to-r from-violet via-blue to-cyan bg-clip-text text-transparent font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(2.75rem,6vw,4.5rem)]">
          Jacky Zhang
        </h1>

        {/* Non-LCP group — kicker + one-liner + CTAs, animated client-side. */}
        <HeroIntro />
      </Section>
    </section>
  );
}
