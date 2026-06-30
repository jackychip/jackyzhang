import { Button } from "@/components/ui/Button";
import { withBasePath } from "@/lib/base-path";

/**
 * not-found — minimal on-brand 404 (CONTEXT discretion / a11y nicety). Reuses
 * the design-system tokens + <Button>; the "Back to home" link is basePath-aware
 * (`withBasePath("/")`) so it resolves under the GitHub Pages `/jackyzhang`
 * project path, not the domain root. Solid near-white display heading — no
 * gradient (matches the de-gradiented monochrome direction).
 */
export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <p className="font-mono text-sm font-normal uppercase tracking-[0.08em] text-text-muted">
          Error 404
        </p>
        <h1 className="font-display font-semibold text-text leading-[1.05] tracking-[-0.02em] text-[clamp(2.5rem,6vw,4rem)]">
          Page not found
        </h1>
        <p className="max-w-md font-sans text-base text-text-muted">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Button as="a" href={withBasePath("/")} variant="secondary">
          Back to home
        </Button>
      </div>
    </main>
  );
}
