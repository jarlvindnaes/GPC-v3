// Story steps: each step of a pinned scroll story (a bullet, a capability, a route caption) becomes a resting point.
// Inside a story a swipe is one step: as soon as the finger moves, the page glides, smoothly and at an even pace,
// to the next step (swiping up) or the previous one (swiping down), instead of coasting on the swipe's momentum and
// being corrected after. Outside the stories the page scrolls as normal.
//
// Switch it per device type here (or for a visit with ?snap=on / ?snap=off, remembered for the session; ?snap=auto
// goes back to these settings):
export const STORY_SNAP = {
  mobile: true, // touch screens (no hover, coarse pointer)
  desktop: true, // mouse wheel and trackpad: a flick is one step
  // false: no stepping, only the browser's own gentle snapping (a scroll that ends near a step settles on it)
  strict: true
};

// How it works: each story registers a function returning its resting points as page scroll positions (from its own
// progress maths, so they follow its timings), from where it pins to where it lets go (its last point is the exit:
// one more swipe from there glides on into the next section, and the page scrolls freely again). The points are
// re-measured whenever the layout changes (also kept as invisible 1px markers for the browser's own snapping, when
// not strict).
//
// Strict, touch: a touch inside a story takes the gesture over (the page's own scrolling is held back for it), and
// once the finger has moved a few pixels its direction starts the glide; a swipe during a glide carries on from that
// glide's step. Touches on things that handle their own dragging (touch-action: none, e.g. the globe, the passport
// phone) are left alone, as are pinches. A scroll that started outside a story and coasts into one is finished by a
// glide to the next step once it comes to rest. Wheel and trackpad: each flick (a burst of wheel events) is one step.

// a story's resting points, and optionally where its top edge is on the page (for its entry: half a screen of it showing)
// (pace: this story's glides take that many times longer, for a story whose moves need time to be followed)
type Source = () => number[] | { points: number[]; top: number; pace?: number };

const sources = new Set<Source>();
const TOUCH = "(hover: none) and (pointer: coarse)";
let layer: HTMLDivElement | null = null;
let queued = false;
let started = false;
let stories: number[][] = []; // each story's points, as scroll positions, in order
let entries: number[] = []; // per story: the scroll position where it fills half the screen, coming from above
let exitsUp: number[] = []; // per story: the scroll position where its top edge is at the bottom of the screen (out of view above)
let paces: number[] = []; // per story: how much longer its glides take

function wanted(): boolean {
  if (typeof window === "undefined") return false;
  let override: string | null = null;
  try {
    const param = new URLSearchParams(location.search).get("snap");
    if (param === "on" || param === "off") sessionStorage.setItem("pc-story-snap", param);
    if (param === "auto") sessionStorage.removeItem("pc-story-snap");
    override = sessionStorage.getItem("pc-story-snap");
  } catch {
    // storage blocked: the setting below applies
  }
  if (override === "on") return true;
  if (override === "off") return false;
  return matchMedia(TOUCH).matches ? STORY_SNAP.mobile : STORY_SNAP.desktop;
}

const stepping = () => STORY_SNAP.strict && document.documentElement.classList.contains("story-snap");

/**
 * The story this scroll position is in: from a little before its first step (three quarters of a screen, as it comes
 * up into place, so arriving from the section above already counts) to its exit.
 */
const storyAt = (y: number) => stories.find((list, i) => y >= entries[i] - 3 && y <= list[list.length - 1] + 3);

// ---- the glide: our own eased scroll, so every step moves at the same calm pace -------------------------------

let glide: { target: number; frame: number } | null = null;
const GLIDE_PACE = 1.5; // how slowly every step glides (1 = 0.42s for a short step)

/**
 * Glides to `target`. `speed` (px per ms, in the glide's direction) is how fast the page was already moving, e.g. the
 * finger that started it: the glide picks that pace up and eases into the step, so a slow drag isn't jerked forward
 * and a flick isn't held back; from rest (0) it eases in and out. `pace` stretches the time (the first step of a
 * story takes longer, as the story settles in).
 */
function glideTo(target: number, speed = 0, pace = 1) {
  if (glide) cancelAnimationFrame(glide.frame);
  const from = window.scrollY;
  const distance = target - from;
  if (Math.abs(distance) < 1) {
    glide = null;
    return;
  }
  // The time follows the distance: a short move (bullet to bullet) is quick, a long one (a new chapter, the globe
  // coming together) gets time for what happens on the way: 0.63s up to 500px, then about 1.35s more per 1000px,
  // at most 2.7s (GLIDE_PACE scales it all: 1.5 = half as slow again as the first version)
  const length = Math.abs(distance);
  // (a story that asks for it glides slower: its steps, and the glide into it)
  const storyPace = paces[stories.findIndex((list) => list.includes(target))] ?? 1;
  const duration = Math.min(1800, 420 + Math.max(0, length - 500) * 0.9) * GLIDE_PACE * pace * storyPace;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = performance.now();
  // a curve that leaves at the given speed and arrives at rest (cubic Hermite), its start capped so it never overshoots
  const lead = Math.min(Math.max(0, speed) * duration, length * 2.5) * Math.sign(distance);
  const at = (u: number) => lead * (u * u * u - 2 * u * u + u) + distance * (3 * u * u - 2 * u * u * u);
  const step = (now: number) => {
    const u = reduce ? 1 : Math.min(1, (now - start) / duration);
    window.scrollTo({ top: from + at(u), behavior: "instant" });
    if (u < 1 && glide) glide.frame = requestAnimationFrame(step);
    else glide = null;
  };
  glide = { target, frame: requestAnimationFrame(step) };
}

/** Where a one-step move in `direction` from `base` goes: the next or previous step, or out of the story at its ends. */
function stepFrom(base: number, direction: number): number | undefined {
  const points = storyAt(base);
  if (!points) return undefined;
  const first = points[0];
  const exit = points[points.length - 1];
  // leaving: one more swipe at either end carries the page out of the story (a good part of a screen); arriving (before
  // its first step), a swipe down goes to the first step
  if (direction > 0 && base >= exit - 3) return exit + window.innerHeight * 0.85;
  // (up: on until the story's top edge reaches the bottom of the screen, so none of it is left half on screen)
  if (direction < 0 && base <= first + 3) return exitsUp[stories.indexOf(points)] ?? Math.max(0, base - window.innerHeight);
  const next = direction > 0 ? points.find((p) => p > base + 3) : [...points].reverse().find((p) => p < base - 3);
  // (the exit is where the story lets go, not a step to rest on: from the last step, one swipe carries on out)
  if (direction > 0 && next === exit) return exit + window.innerHeight * 0.85;
  return next;
}

/** How much longer a glide into a story's first step takes, coming from above (the story settles in). */
const FIRST_STEP_PACE = 1.5;
const isFirstStep = (target: number) => stories.some((list) => Math.abs(list[0] - target) < 1);

/** A swipe or flick: one step on from where the page is (or is gliding to), picking up the finger's speed. */
function swipe(direction: number, speed = 0) {
  const base = glide ? glide.target : window.scrollY;
  const target = stepFrom(base, direction);
  if (target === undefined) return;
  glideTo(target, speed, direction > 0 && isFirstStep(target) ? FIRST_STEP_PACE : 1);
}

/** True when this touch is on something that handles its own dragging or scrolls sideways. */
function ownsTouch(target: EventTarget | null): boolean {
  for (let el = target instanceof Element ? target : null; el && el !== document.documentElement; el = el.parentElement) {
    const style = getComputedStyle(el);
    const action = style.touchAction;
    if (action === "none" || (action.includes("pan-x") && !action.includes("pan-y")) || action === "pinch-zoom") return true;
    // something that scrolls sideways (the chapter tabs on phones): its swipes stay its own
    if (/(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 1) return true;
  }
  return false;
}

// ---- story controls: a "Swipe ↓" hint top right in a story (on each entry, until the first swipe there) and a
// "Skip story ↓" button through the story (not on its last step), jumping to the next story's first step ----

let swiped = false; // (since entering the current story)
let shownStory = -1; // the story the page is in (-1: none), so the hint returns on every entry
let hint: HTMLElement | null = null;
let skip: HTMLButtonElement | null = null;

/** Fades a control in or out; while out it is taken off the page (display: none), not just made invisible. */
function show(el: HTMLElement, on: boolean) {
  const want = on ? "1" : "0";
  if (el.dataset.want === want) return;
  el.dataset.want = want;
  window.clearTimeout(Number(el.dataset.hideTimer || 0));
  if (on) {
    el.hidden = false;
    requestAnimationFrame(() => {
      if (el.dataset.want === "1") el.classList.add("is-on");
    });
  } else {
    el.classList.remove("is-on");
    el.dataset.hideTimer = String(window.setTimeout(() => (el.hidden = true), 360));
  }
}

function controls() {
  const bar = document.createElement("div");
  bar.className = "story-steps-nav";
  hint = document.createElement("span");
  hint.className = "story-steps-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.hidden = true;
  // "Swipe" on touch screens, "Scroll" with a mouse or trackpad
  hint.textContent = matchMedia(TOUCH).matches ? "Swipe ↓" : "Scroll ↓";
  skip = document.createElement("button");
  skip.type = "button";
  skip.className = "story-steps-skip";
  skip.tabIndex = -1;
  skip.hidden = true;
  skip.innerHTML = 'Skip story <span aria-hidden="true">↓</span>';
  skip.addEventListener("click", () => {
    const points = storyAt(glide ? glide.target : window.scrollY);
    if (!points) return;
    // a jump, not a glide: straight to the next story's first step (or, after the last story, past this one's exit)
    if (glide) {
      cancelAnimationFrame(glide.frame);
      glide = null;
    }
    const exit = points[points.length - 1];
    const next = stories.filter((list) => list[0] > exit).sort((a, b) => a[0] - b[0])[0];
    window.scrollTo({ top: next ? next[0] : exit + window.innerHeight * 0.85, behavior: "instant" });
  });
  bar.append(hint, skip);
  document.body.append(bar);
  let queued = false;
  const update = () => {
    queued = false;
    const y = glide ? glide.target : window.scrollY;
    const points = stepping() ? storyAt(y) : undefined;
    const inStory = Boolean(points && y >= points[0] - 3);
    const lastStep = points ? points[points.length - 2] : 0; // (the last point is the exit)
    const skipOn = inStory && y < lastStep - 3;
    // (anywhere in a story, until the first swipe or scroll step there; back each time a story is entered, even again)
    const current = inStory && points ? stories.indexOf(points) : -1;
    if (current !== shownStory) {
      shownStory = current;
      if (current >= 0) swiped = false;
    }
    const hintOn = inStory && !swiped;
    if (hintOn) {
      // below the site header (while shown) and the homepage story's chapter tabs
      let top = 0;
      for (const bar of document.querySelectorAll<HTMLElement>("[data-site-header], .benefit-nav")) {
        const box = bar.getBoundingClientRect();
        if (box.bottom > 0 && box.top < window.innerHeight / 3) top = Math.max(top, box.bottom);
      }
      hint!.style.setProperty("--story-hint-top", `${Math.round(top + 24)}px`);
    }
    show(hint!, hintOn);
    show(skip!, skipOn);
    skip!.tabIndex = skipOn ? 0 : -1;
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  // the site header slides in and out without a scroll: follow it once its slide (0.3s) is done
  const header = document.querySelector("[data-site-header]");
  if (header) new MutationObserver(() => window.setTimeout(queue, 340)).observe(header, { attributes: true, attributeFilter: ["class"] });
  update();
}

function start() {
  if (started) return;
  started = true;
  const style = document.createElement("style");
  style.textContent =
    "html.story-snap:not(.story-snap-strict){scroll-snap-type:y proximity}" +
    ".story-snap-points{position:absolute;top:0;left:0;width:1px;height:0;pointer-events:none;visibility:hidden}" +
    ".story-snap-points>i{position:absolute;left:0;width:1px;height:1px;scroll-snap-align:start}" +
    // the story controls: anchored to the small viewport's bottom (100svh, never under Safari's toolbar) and so far
    // from the screen's edge (iOS: nothing within 8px of the bottom edge, or the page stops running under the toolbar)
    // (no box of their own: a fixed strip across the screen near its bottom, even an invisible one, makes iOS Safari
    // treat the page as an app with a bottom bar; each control is placed by itself, and is gone while hidden)
    ".story-steps-nav{display:contents}" +
    ".story-steps-nav>*{position:fixed;z-index:30;top:calc(100svh - 16px - 40px);height:40px;pointer-events:none;font:500 13px/1 Inter,Arial,sans-serif;display:inline-flex;align-items:center;gap:8px;padding:0 15px;border:1px solid #ffffff2e;border-radius:999px;background:#1d2433e0;color:#f5f6f0;box-shadow:0 -2px 10px #050b1b33;opacity:0;transform:translateY(6px);transition:opacity .35s ease,transform .35s ease;white-space:nowrap}" +
    ".story-steps-nav>.is-on{opacity:1;transform:none}" +
    // the hint: top right, just below whatever bars are showing at the top (set as you scroll)
    ".story-steps-nav>.story-steps-hint{top:var(--story-hint-top,80px);right:16px}" +
    ".story-steps-nav>[hidden]{display:none}" +
    ".story-steps-nav>.story-steps-skip{right:16px;margin:0;min-width:0;cursor:pointer;font:inherit;appearance:none}" +
    ".story-steps-skip.is-on{pointer-events:auto}" +
    ".story-steps-skip:focus-visible{outline:2px solid #d6ef8c;outline-offset:3px}" +
    "html[data-overlay-open] .story-steps-nav{display:none}" +
    "@media(prefers-reduced-motion:reduce){.story-steps-nav>*{transition:none;transform:none}}";
  document.head.append(style);
  controls();
  const refresh = () => refreshSnapPoints();
  // Only a change of width re-measures on resize: iOS Safari's toolbar changes the height on every swipe.
  let width = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    refresh();
  });
  window.addEventListener("load", refresh);
  // ...and once more a moment after load: timings that move no layout (a step's CSS values) aren't seen by the observer
  window.addEventListener("load", () => setTimeout(refresh, 1000), { once: true });
  new ResizeObserver(refresh).observe(document.body);
  matchMedia(TOUCH).addEventListener("change", refresh);

  // ---- touch: take the swipe over inside a story ----
  let mode: "none" | "pending" | "taken" | "native" = "none";
  let x0 = 0;
  let y0 = 0;
  let t0 = 0; // (for the finger's speed)
  window.addEventListener(
    "touchstart",
    (event) => {
      x0 = event.touches[0]?.clientX ?? 0;
      y0 = event.touches[0]?.clientY ?? 0;
      t0 = event.timeStamp;
      const base = glide ? glide.target : window.scrollY;
      const inside = stepping() && event.touches.length === 1 && storyAt(base) && !ownsTouch(event.target);
      mode = inside ? "pending" : "native";
      if (!inside && glide) {
        cancelAnimationFrame(glide.frame); // a touch outside takes over from a glide
        glide = null;
      }
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (event) => {
      if (mode === "native" || mode === "none") return;
      if (event.touches.length > 1) {
        mode = "native"; // a pinch
        return;
      }
      if (event.cancelable) event.preventDefault(); // the page doesn't scroll itself during a taken gesture
      if (mode === "taken") return;
      const dx = (event.touches[0]?.clientX ?? 0) - x0;
      const dy = (event.touches[0]?.clientY ?? 0) - y0;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        mode = "native"; // sideways: not a step
        return;
      }
      mode = "taken";
      swiped = true;
      const speed = Math.abs(dy) / Math.max(16, event.timeStamp - t0); // px per ms so far
      swipe(dy < 0 ? 1 : -1, speed); // finger up: the next step
    },
    { passive: false }
  );
  const release = () => {
    const wasNative = mode === "native";
    mode = "none";
    // a story came half into view while the finger was still on the screen: take over now it's lifted
    if (wasNative && entering !== null) {
      const first = stories[entering]?.[0];
      entering = null;
      if (first !== undefined && velocity > 0 && window.scrollY < first - 3) {
        glideTo(first, Math.min(3, velocity), FIRST_STEP_PACE);
        return;
      }
    }
    if (wasNative) later();
  };
  window.addEventListener("touchend", release, { passive: true });
  window.addEventListener("touchcancel", release, { passive: true });

  // ---- the page never rests between two steps of a story: any scroll of the page's own (one the phone or browser
  // ran, or a jump from a link) that comes to rest there, with no finger on the screen, is finished with a glide ----
  let timer = 0;
  let lastDirection = 0; // the way the page's own scrolling last went (0: a jump)
  const later = () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (mode !== "none" || glide) return;
      settle(window.scrollY, lastDirection);
      lastDirection = 0;
    }, 180);
  };
  // ---- arriving at a story from above: once half of it shows, glide on to its first step at the scroll's own speed
  // (straight away during momentum or a wheel scroll; when the finger lifts, if it is still down) ----
  let lastY = window.scrollY;
  let lastT = performance.now();
  let velocity = 0; // px per ms, positive downwards
  let entering: number | null = null; // the story whose entry was crossed with the finger still down
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      if (!glide) velocity = velocity * 0.4 + ((y - lastY) / dt) * 0.6;
      const before = lastY;
      lastY = y;
      lastT = now;
      if (!glide) {
        lastDirection = Math.abs(y - before) > window.innerHeight ? 0 : Math.sign(y - before) || lastDirection;
        later();
      }
      if (!stepping() || glide || mode === "pending" || mode === "taken" || y <= before) return;
      if (y - before > window.innerHeight) return; // a jump (a menu link), not a scroll
      const crossed = entries.findIndex((entry, i) => before < entry && y >= entry && y < stories[i][0] - 3);
      if (crossed < 0) return;
      if (mode === "native") {
        entering = crossed; // the finger is still down
        return;
      }
      glideTo(stories[crossed][0], Math.min(3, Math.max(0, velocity)), FIRST_STEP_PACE);
    },
    { passive: true }
  );

  // ---- wheel and trackpad: each flick (a burst of wheel events, momentum included) is one step ----
  // A trackpad flick keeps sending (fading) events for a second or two after its glide has ended; all of them belong to
  // that flick and are held back, or the page would coast on and take more steps. A new flick is a pause of 0.22s,
  // or, within a fading flick, a sudden much stronger event (a deliberate second flick).
  let lastWheel = 0;
  let lastStrength = 0;
  let flickStart = 0;
  let inFlick = false; // the current burst has made its step
  window.addEventListener(
    "wheel",
    (event) => {
      if (!stepping() || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const base = glide ? glide.target : window.scrollY;
      if (!storyAt(base) || ownsTouch(event.target)) return;
      const now = performance.now();
      const strength = Math.abs(event.deltaY);
      const paused = now - lastWheel > 220;
      const harder = inFlick && now - flickStart > 350 && strength > 25 && strength > lastStrength * 2.5;
      lastWheel = now;
      lastStrength = strength;
      if (paused) inFlick = false;
      const direction = Math.sign(event.deltaY);
      if ((paused || harder) && direction) {
        const target = stepFrom(base, direction);
        if (target === undefined) return;
        event.preventDefault();
        inFlick = true;
        flickStart = now;
        swiped = true; // (the hint has done its job)
        glideTo(target, 0, direction > 0 && isFirstStep(target) ? FIRST_STEP_PACE : 1);
      } else if (inFlick) {
        event.preventDefault(); // the rest of the flick, its momentum included
      }
    },
    { passive: false }
  );
}

/**
 * The page came to rest (by its own scrolling, or a jump) inside a story between two steps: on to the next step in
 * the way it was going (a jump: the nearest step). Above a story's first step: on into the story going down, out of
 * view going up.
 */
function settle(to: number, direction: number) {
  if (!stepping()) return;
  const points = storyAt(to);
  if (!points) return;
  const index = stories.indexOf(points);
  if (to < points[0] - 3) {
    if (direction > 0) glideTo(points[0], 0, FIRST_STEP_PACE);
    else if (direction < 0 && to > exitsUp[index] + 3) glideTo(exitsUp[index], 0, FIRST_STEP_PACE);
    return;
  }
  if (points.some((p) => Math.abs(p - to) <= 3)) return; // resting on a step
  const ahead = points.find((p) => p > to);
  const behind = [...points].reverse().find((p) => p < to);
  const nearest =
    ahead === undefined ? behind : behind === undefined ? ahead : ahead - to < to - behind ? ahead : behind;
  const target = direction > 0 ? ahead ?? behind : direction < 0 ? behind ?? ahead : nearest;
  const exit = points[points.length - 1];
  // (going down past the last step: on out of the story, not to a stop at its exit)
  if (target === exit && direction > 0) glideTo(exit + window.innerHeight * 0.85);
  else if (target !== undefined) glideTo(target);
}

function rebuild() {
  queued = false;
  const on = wanted() && sources.size > 0;
  document.documentElement.classList.toggle("story-snap", on);
  document.documentElement.classList.toggle("story-snap-strict", on && STORY_SNAP.strict);
  if (!on) {
    stories = [];
    layer?.replaceChildren();
    return;
  }
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "story-snap-points";
    layer.setAttribute("aria-hidden", "true");
    document.body.append(layer);
  }
  // a marker's top lands under the page's scroll padding (the room kept for the header), so it sits that much lower
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const read = [...sources].map((source) => {
    const result = source();
    const list = (Array.isArray(result) ? result : result.points).filter((y) => Number.isFinite(y) && y >= 0);
    return {
      list: [...list].sort((a, b) => a - b),
      top: Array.isArray(result) ? undefined : result.top,
      pace: Array.isArray(result) ? 1 : result.pace ?? 1
    };
  });
  const lists = read.map((story) => story.list);
  const kept = read.filter((story) => story.list.length > 1);
  stories = kept.map((story) => story.list);
  paces = kept.map((story) => story.pace);
  // entry: half a screen of the story showing (its top edge at the middle of the screen); without a top edge,
  // three quarters of a screen before its first step
  const vh = document.documentElement.clientHeight;
  entries = kept.map((story) =>
    Math.min(story.list[0], story.top !== undefined ? story.top - vh / 2 : story.list[0] - vh * 0.75)
  );
  exitsUp = entries.map((entry) => Math.max(0, entry - vh / 2));
  const points = lists
    .flat()
    .map((y) => Math.round(y + padding))
    .sort((a, b) => a - b);
  // the same markers stay, moved only where a point really moved (each change makes the browser re-snap)
  const markers = Array.from(layer.children) as HTMLElement[];
  const same =
    markers.length === points.length && markers.every((marker, i) => Math.abs(parseFloat(marker.style.top) - points[i]) < 4);
  if (same) return;
  while (layer.children.length > points.length) layer.lastElementChild?.remove();
  points.forEach((top, i) => {
    let marker = layer!.children[i] as HTMLElement | undefined;
    if (!marker) {
      marker = document.createElement("i");
      layer!.append(marker);
    }
    if (Math.abs(parseFloat(marker.style.top) - top) >= 4 || !marker.style.top) marker.style.top = `${top}px`;
  });
}

/** Re-measures every story's resting points (on the next frame). */
export function refreshSnapPoints() {
  if (typeof window === "undefined" || queued) return;
  queued = true;
  requestAnimationFrame(rebuild);
}

/** Adds a story's resting points (page scroll positions, re-read on every refresh); returns a function to remove them. */
export function registerSnapPoints(source: Source): () => void {
  if (typeof window === "undefined") return () => {};
  start();
  sources.add(source);
  refreshSnapPoints();
  return () => {
    sources.delete(source);
    refreshSnapPoints();
  };
}
