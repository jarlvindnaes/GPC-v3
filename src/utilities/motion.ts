// Site-wide motion setting (WCAG 2.2.2): motion is paused when the system asks for reduced motion OR the visitor
// pressed "Pause animations" in the footer (html.motion-paused, remembered in localStorage and applied before
// first paint by an inline script in each page's <head>). CSS keyframe animations are paused by the same class
// (see motion.css); script-driven animations read `reducedMotion` below, which mirrors the MediaQueryList API
// they used before, so `reduced.matches` and its "change" event keep working for both reasons.

const STORAGE_KEY = "pc-motion-paused";
const EVENT = "pc:motion";

const query: MediaQueryList | null =
  typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

export function userPausedMotion(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("motion-paused");
}

export function motionPaused(): boolean {
  return Boolean(query?.matches) || userPausedMotion();
}

export function setUserPausedMotion(paused: boolean): void {
  document.documentElement.classList.toggle("motion-paused", paused);
  try {
    localStorage.setItem(STORAGE_KEY, paused ? "1" : "0");
  } catch {
    // private mode or blocked storage: the choice still applies to this page
  }
  window.dispatchEvent(new Event(EVENT));
}

type Listener = () => void;

/** MediaQueryList-like view of motionPaused(): `.matches` plus "change" listeners for both causes. */
export const reducedMotion = {
  get matches(): boolean {
    return motionPaused();
  },
  addEventListener(_type: "change", listener: Listener): void {
    query?.addEventListener("change", listener);
    window.addEventListener(EVENT, listener);
  },
  removeEventListener(_type: "change", listener: Listener): void {
    query?.removeEventListener("change", listener);
    window.removeEventListener(EVENT, listener);
  }
};
