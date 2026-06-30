import { Section } from "@/components/ui/Section";
import { HeroIntro } from "@/components/HeroIntro";

/**
 * Hero — the LCP-safe terminal hero (HERO-01/02/03, D-02..D-05).
 *
 * HARD RULE (HERO-03 / Pitfall 3): this is a Server Component that imports
 * NOTHING from the animation library (intentionally no such import in this
 * file). The `<h1>` "Jacky Zhang" is the LCP element — it renders statically at
 * full opacity, never animated and never given an `initial={{opacity:0}}`.
 *
 * Design: per owner request the gradient display name (locked D-01) is replaced
 * by a terminal "prompt + whoami output" treatment — a decorative monospace
 * prompt line above a solid near-white, JetBrains-Mono name with a blinking
 * cyan cursor. The name is now solid-colored (not `text-transparent`), so it is
 * doubly safe as the LCP element. The blinking cursor is a CSS keyframe
 * (`.terminal-cursor`) gated by the prefers-reduced-motion guard in globals.css.
 *
 * Only the kicker / sub-headline / CTA group (in the client <HeroIntro/>)
 * animates — the static name is never gated behind that entrance.
 *
 * Layout (D-05): centered single column, vertically centered in `min-h-[100svh]`
 * (small-viewport height avoids the mobile URL-bar jump). The background is flat
 * dark — the former violet ambient radial glow (D-04) was removed per owner
 * request along with the gradient direction.
 */
export function Hero() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden">
      <Section className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Terminal block — decorative prompt line + the LCP name as output. */}
        <div className="flex flex-col items-center gap-3">
          {/* Decorative shell prompt (aria-hidden — the h1 carries the real name). */}
          <p
            aria-hidden="true"
            className="font-mono text-sm text-text-muted sm:text-base"
          >
            <span className="text-cyan">visitor@jackyzhang</span>
            <span className="text-cyan">:~$</span> whoami
          </p>

          {/* The LCP headline. STATIC. No animation. Solid near-white. */}
          <h1 className="font-mono font-semibold text-text leading-[1.05] tracking-[-0.02em] text-[clamp(2.5rem,5.5vw,4rem)]">
            Jacky Zhang
            <span aria-hidden="true" className="terminal-cursor ml-1 text-cyan">
              ▮
            </span>
          </h1>
        </div>

        {/* Non-LCP group — kicker + one-liner + CTAs, animated client-side. */}
        <HeroIntro />
      </Section>
    </section>
  );
}
