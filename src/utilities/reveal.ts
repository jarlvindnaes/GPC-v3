// The page's own sections (not the full stories, which have their own motion, nor the hero): as each piece of text
// comes into view (headline, eyebrow, lines, points, buttons), it fades up into place, the ones arriving together a
// beat apart, and again each time it is come back to. Without JavaScript, or with reduced motion, everything simply
// shows. Text already on screen when the page loads stays as it is until it has been scrolled away.

const GROUPS = "main > :not([data-story-takeover]):not(.hero):not(astro-island):not(script)";
const TEXT = ":is(h2, h3, .eyebrow, .tag, .teaser-eyebrow, .memory-tag, p, li, blockquote, figcaption, .button, .teaser-open)";
// (no text inside drawings, charts and their controls, or anything hidden from assistive tech)
const SKIP = "canvas, svg, .teaser-visual, .memory-chart, .memory-foot, .memory-legend, .memory-track, [aria-hidden='true']";

let started = false;

export function initReveal() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const style = document.createElement("style");
  style.textContent =
    "html.reveal-on .rv{opacity:0;translate:0 36px}" +
    "html.reveal-on .rv.rv-in{opacity:1;translate:0 0;transition:opacity .9s ease var(--rv-d,0s),translate 1.1s cubic-bezier(.16,.8,.3,1) var(--rv-d,0s)}";
  document.head.append(style);

  const targets: HTMLElement[] = [];
  for (const group of document.querySelectorAll<HTMLElement>(GROUPS)) {
    for (const el of group.querySelectorAll<HTMLElement>(TEXT)) {
      if (el.closest(SKIP)) continue;
      // (the outermost piece only: a point's own lines move with it)
      if (el.parentElement?.closest(TEXT) && group.contains(el.parentElement.closest(TEXT))) continue;
      if (!el.textContent?.trim()) continue;
      targets.push(el);
    }
  }
  const pending = targets.filter((el) => el.getBoundingClientRect().top > window.innerHeight);
  if (!targets.length) return;
  for (const el of pending) el.classList.add("rv");
  document.documentElement.classList.add("reveal-on");

  // arriving: as soon as it is a little way onto the screen; leaving: only once well off it (never vanishing in sight),
  // it is set back, to arrive again next time
  const timers = new Map<HTMLElement, number>();
  const arrive = new IntersectionObserver(
    (entries) => {
      const arriving = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target as HTMLElement)
        .filter((el) => el.classList.contains("rv") && !el.classList.contains("rv-in"));
      arriving.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      arriving.forEach((el, i) => {
        el.style.setProperty("--rv-d", `${Math.min(i, 6) * 0.12}s`);
        el.classList.add("rv-in");
        // (once arrived, back to its own styles: hover and the like)
        timers.set(el, window.setTimeout(() => {
          el.classList.remove("rv", "rv-in");
          el.style.removeProperty("--rv-d");
          timers.delete(el);
        }, 1800 + Math.min(i, 6) * 120));
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0 } // (starts as soon as it is a little way onto the screen; the reset, below, waits until it is well off)
  );
  // (200px beyond the screen: the 36px a hidden piece sits lower can't carry it back into view and start a loop)
  const leave = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      window.clearTimeout(timers.get(el));
      timers.delete(el);
      el.classList.remove("rv-in");
      el.style.removeProperty("--rv-d");
      el.classList.add("rv");
    }
  }, { rootMargin: "200px 0px" });
  for (const el of targets) {
    arrive.observe(el);
    leave.observe(el);
  }
}
