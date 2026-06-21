import Lenis from "lenis";
import { cancelFrame, frame } from "motion/react";
import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/**
 * Global smooth-scroll island.
 *
 * Initializes Lenis once and exposes the instance on `window.__lenis` so other
 * islands (e.g. BackToTop) can reach it. In the previous SPA this was shared via
 * React context, but context cannot cross Astro island boundaries — each island
 * is its own React root — so a window singleton is the portable equivalent.
 *
 * Renders nothing; mount once per page via `client:load`.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false });
    window.__lenis = lenis;

    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return null;
}
