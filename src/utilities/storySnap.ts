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
// (pace: this story's glides take that many times longer, for a story whose moves need time to be followed;
// quick: a stretch of it, from and to scroll positions, whose step-to-step glides take at most ms, for steps that sit
// far apart in scroll but should feel as brisk as the rest; dots: its progress dots, one li per step, lit here for the
// step the page rests on or is gliding to, so a dot moves the moment a step is chosen, not when the page arrives;
// leads: per step, where a click on its dot jumps to before gliding onto it, default the step before it; entryMs:
// the glide into its first step from above takes that long, whatever the distance (default: as its other glides); hintLow: on
// touch screens its "Swipe ↓" hint sits just above its dots, clear of text at the top of its screen)
type Quick = { from: number; to: number; ms: number };
type Source = () =>
  | number[]
  | {
      points: number[];
      top: number;
      pace?: number;
      entryMs?: number;
      quick?: Quick;
      dots?: HTMLElement | null;
      leads?: number[];
      hintLow?: boolean;
    };

const sources = new Set<Source>();
const TOUCH = "(hover: none) and (pointer: coarse)";
let layer: HTMLDivElement | null = null;
let queued = false;
let started = false;
let stories: number[][] = []; // each story's points, as scroll positions, in order
let entries: number[] = []; // per story: the scroll position where it fills half the screen, coming from above
let exitsUp: number[] = []; // per story: the scroll position where its top edge is at the bottom of the screen (out of view above)
let paces: number[] = []; // per story: how much longer its glides take
let entryMs: (number | undefined)[] = []; // per story: how long its way in takes, if set
let quicks: Quick[] = []; // stretches whose step-to-step glides are capped
let dotLists: (HTMLElement | null)[] = []; // per story: its progress dots
let leadLists: (number[] | undefined)[] = []; // per story: where a dot's jump starts, per step
let hintLows: boolean[] = []; // per story: its hint above its dots on touch screens

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
// (kick: for a click, not a swipe: the glide sets off at once, at that many times its average speed, and eases out as
// it arrives, rather than easing in from a standstill, which after a click reads as a delay)
const CLICK_KICK = 1.6;
function glideTo(target: number, speed = 0, pace = 1, kick = 0) {
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
  const s = stories.findIndex((list) => list.includes(target));
  const entering = s >= 0 && target === stories[s][0] && from < target - 3; // (into its first step, from above)
  const storyPace = paces[s] ?? 1;
  const quick = quicks.find((q) => from >= q.from - 3 && from <= q.to + 3 && target >= q.from - 3 && target <= q.to + 3);
  const duration =
    entering && entryMs[s] !== undefined
      ? entryMs[s]!
      : Math.min(Math.min(1800, 420 + Math.max(0, length - 500) * 0.9) * GLIDE_PACE * pace * storyPace, quick?.ms ?? Infinity);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = performance.now();
  // a curve that leaves at the given speed and arrives at rest (cubic Hermite), its start capped so it never overshoots
  const lead = Math.max(Math.min(Math.max(0, speed) * duration, length * 2.5), length * kick) * Math.sign(distance);
  const at = (u: number) => lead * (u * u * u - 2 * u * u + u) + distance * (3 * u * u - 2 * u * u * u);
  const step = (now: number) => {
    const u = reduce ? 1 : Math.min(1, (now - start) / duration);
    window.scrollTo({ top: from + at(u), behavior: "instant" });
    if (u < 1 && glide) glide.frame = requestAnimationFrame(step);
    else glide = null;
  };
  glide = { target, frame: requestAnimationFrame(step) };
  onGlide(); // (the dots and arrows follow the chosen step straight away)
}
let onGlide = () => {};

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

/**
 * A story's previous/next arrow (StoryDotsNav.astro): one step, like a swipe, but never out of the story at its ends
 * (from above it, next goes to its first step).
 */
function arrowStep(direction: number) {
  const base = glide ? glide.target : window.scrollY;
  const points = storyAt(base);
  if (!points) return;
  const lastStep = points[points.length - 2]; // (the last point is the exit)
  if (direction > 0 ? base >= lastStep - 3 : base <= points[0] + 3) return;
  const target = base < points[0] - 3 ? points[0] : stepFrom(base, direction);
  if (target === undefined) return;
  swiped = true; // (the hint has done its job)
  glideTo(target, 0, direction > 0 && isFirstStep(target) ? FIRST_STEP_PACE : 1, CLICK_KICK);
}

/**
 * A click on one of a story's dots, like the homepage story's chapter tabs: the next or previous step glides there;
 * further, the page jumps to that step's lead-in (the step before it, or where its story sets) and glides on from
 * there, so it shows the way into the step rather than scrolling through everything between.
 */
function dotStep(dot: HTMLElement) {
  const list = dot.parentElement;
  const s = list ? dotLists.indexOf(list) : -1;
  const points = stories[s];
  if (!points) return;
  const index = Math.min(Array.prototype.indexOf.call(list!.children, dot) as number, points.length - 2); // (never the exit)
  const target = points[index];
  if (target === undefined) return;
  const base = glide ? glide.target : window.scrollY;
  let current = 0;
  for (let i = 0; i < points.length - 1; i++) if (points[i] <= base + 3) current = i;
  swiped = true; // (the hint has done its job)
  if (Math.abs(index - current) > 1 || base < points[0] - 3) {
    const lead = leadLists[s]?.[index] ?? points[index - 1] ?? Math.max(0, target - window.innerHeight);
    if (glide) {
      cancelAnimationFrame(glide.frame);
      glide = null;
    }
    window.scrollTo({ top: lead, behavior: "instant" });
  }
  glideTo(target, 0, 1, CLICK_KICK);
}

// ---- the dots like the macOS Dock (mouse and trackpad): they swell in a wave around the pointer and the ones near it
// spread apart, the rest of the row closing up so its width (and its two ends) stay as they are; with a tooltip naming
// the step under it (data-group over data-title) ----
const FINE = "(hover: hover) and (pointer: fine)";
function dockDots(nav: HTMLElement) {
  const list = nav.querySelector<HTMLElement>("ol");
  if (!list || nav.dataset.dock) return;
  nav.dataset.dock = "1";
  const tip = document.createElement("span");
  tip.className = "story-dot-tip";
  tip.setAttribute("aria-hidden", "true");
  nav.append(tip);
  let centres: number[] = []; // (the dots' centres at rest, so the wave doesn't chase its own spread)
  let widths: number[] = [];
  const GROW = 1.5; // (a dot right under the pointer: 2.5 times its size)
  let over: HTMLElement | null = null;
  const dots = () => Array.from(list.children) as HTMLElement[];
  const nearestTo = (x: number) => {
    let n = 0;
    centres.forEach((c, i) => {
      if (Math.abs(x - c) < Math.abs(x - centres[n])) n = i;
    });
    return n;
  };
  // only the dot under the pointer (in full) and the one either side of it (part way) swell
  const wave = (x: number | null) => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = x === null || reduce ? -1 : nearestTo(x);
    const items = dots();
    const swell = items.map((_, i) => (n < 0 ? 0 : i === n ? 1 : Math.abs(i - n) === 1 ? 0.45 : 0));
    items.forEach((dot, i) => dot.style.setProperty("--dock", String(swell[i])));
    // the spread: each gap widens by half of what its two dots grow, then all gaps scale back to the row's own width
    const grow = swell.map((m, i) => m * widths[i] * GROW);
    const gaps = centres.slice(1).map((c, i) => c - centres[i] + (grow[i] + grow[i + 1]) / 2);
    const total = centres[centres.length - 1] - centres[0];
    const fit = total / Math.max(1, gaps.reduce((sum, g) => sum + g, 0));
    let at = centres[0];
    items.forEach((dot, i) => {
      if (i > 0) at += gaps[i - 1] * fit;
      dot.style.setProperty("--dock-x", `${(at - centres[i]).toFixed(2)}px`);
    });
  };
  // (a dot, or one of the buttons: those by their own box, as they don't move with the wave)
  const showTip = (dot: HTMLElement | null) => {
    over = dot;
    if (!dot || !dot.dataset.title) {
      tip.classList.remove("is-on");
      return;
    }
    const isDot = dot.parentElement === list;
    tip.replaceChildren();
    if (dot.dataset.group) {
      const group = document.createElement("small");
      group.textContent = dot.dataset.group;
      tip.append(group);
    }
    tip.append(dot.dataset.title);
    const box = nav.getBoundingClientRect();
    const i = dots().indexOf(dot);
    const own = dot.getBoundingClientRect();
    const centre = isDot ? (centres[i] ?? 0) + (parseFloat(dot.style.getPropertyValue("--dock-x")) || 0) : own.left + own.width / 2;
    tip.style.left = `${Math.round(centre - box.left)}px`;
    tip.classList.add("is-on");
  };
  list.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse" || !matchMedia(FINE).matches) return;
    for (const dot of dots()) {
      dot.style.setProperty("--dock", "0");
      dot.style.setProperty("--dock-x", "0px");
      dot.style.transition = "background-color .3s, transform .3s, scale .16s ease-out, translate .16s ease-out";
    }
    const boxes = dots().map((dot) => dot.getBoundingClientRect());
    centres = boxes.map((r) => r.left + r.width / 2);
    widths = boxes.map((r) => r.width);
  });
  list.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || !centres.length) return;
    wave(event.clientX);
    // the tooltip: the dot nearest the pointer
    const nearest = dots()[nearestTo(event.clientX)] ?? null;
    if (nearest !== over) showTip(nearest);
  });
  list.addEventListener("pointerleave", () => {
    wave(null);
    showTip(null);
    centres = [];
  });
  // the arrows, « and »: their tooltip on hover (mouse) and on keyboard focus
  for (const button of nav.querySelectorAll<HTMLElement>("[data-story-leave], [data-story-step]")) {
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") showTip(button);
    });
    button.addEventListener("pointerleave", () => showTip(null));
    button.addEventListener("focus", () => {
      if (button.matches(":focus-visible")) showTip(button);
    });
    button.addEventListener("blur", () => showTip(null));
  }
  // a click anywhere along the row goes to the dot nearest it (the dots are small; their gaps count too)
  list.addEventListener("click", (event) => {
    if (!stepping()) return;
    const items = dots();
    const at = centres.length
      ? centres
      : items.map((dot) => {
          const r = dot.getBoundingClientRect();
          return r.left + r.width / 2;
        });
    let nearest = 0;
    at.forEach((c, i) => {
      if (Math.abs(event.clientX - c) < Math.abs(event.clientX - at[nearest])) nearest = i;
    });
    if (items[nearest]) dotStep(items[nearest]);
  });
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

// ---- story controls: a "Swipe ↓" hint top right in a story (on each entry, until the first swipe there); the way
// out of a story is the « and » buttons beside its dots (StoryDotsNav.astro, leaveStory) ----

let swiped = false; // (since entering the current story)
let shownStory = -1; // the story the page is in (-1: none), so the hint returns on every entry
let hint: HTMLElement | null = null;

/**
 * A story's « or » button: a jump (not a glide) out of the story it sits in, » to the section after it (its top at
 * the top of the screen), « to the one before it (the story's top edge at the bottom of the screen).
 */
function leaveStory(button: HTMLElement, direction: number) {
  const story = button.closest<HTMLElement>("section");
  if (!story) return;
  if (glide) {
    cancelAnimationFrame(glide.frame);
    glide = null;
  }
  const box = story.getBoundingClientRect();
  const top = direction > 0 ? box.bottom + window.scrollY : Math.max(0, box.top + window.scrollY - window.innerHeight);
  window.scrollTo({ top, behavior: "instant" });
}

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
  bar.append(hint);
  document.body.append(bar);
  let queued = false;
  const update = () => {
    queued = false;
    const y = glide ? glide.target : window.scrollY;
    const points = stepping() ? storyAt(y) : undefined;
    const inStory = Boolean(points && y >= points[0] - 3);
    const lastStep = points ? points[points.length - 2] : 0; // (the last point is the exit)
    // (anywhere in a story, until the first swipe or scroll step there; back each time a story is entered, even again)
    const current = inStory && points ? stories.indexOf(points) : -1;
    if (current !== shownStory) {
      shownStory = current;
      if (current >= 0) swiped = false;
    }
    const hintOn = inStory && !swiped && y < lastStep - 3; // (not on the last step: nothing further to swipe to there)
    if (hintOn) {
      // below the site header (while shown) and the homepage story's chapter tabs; or, for a story that asks, on touch
      // screens just above its dots (its own height, 40px, and 12px clear)
      const dots = hintLows[current] && matchMedia(TOUCH).matches ? dotLists[current]?.closest(".story-dots-nav") : null;
      const dotsTop = dots?.getBoundingClientRect().top;
      let top = 0;
      for (const bar of document.querySelectorAll<HTMLElement>("[data-site-header], .benefit-nav")) {
        const box = bar.getBoundingClientRect();
        if (box.bottom > 0 && box.top < window.innerHeight / 3) top = Math.max(top, box.bottom);
      }
      hint!.style.setProperty("--story-hint-top", `${Math.round(dotsTop ? dotsTop - 40 - 12 : top + 24)}px`);
    }
    show(hint!, hintOn);
    // each story's dots: the step at or before where the page rests or glides to (its steps: every point but the exit)
    stories.forEach((list, s) => {
      const dots = dotLists[s]?.children;
      if (!dots) return;
      let on = 0;
      for (let i = 0; i < list.length - 1; i++) if (list[i] <= y + 3) on = i;
      on = Math.min(on, dots.length - 1); // (a story can rest once more past its last dot: the route's totals)
      for (let i = 0; i < dots.length; i++) dots[i].classList.toggle("is-on", i === on);
    });
    // the arrows: dimmed at the story's first and last step (aria-disabled, so a focused one keeps its focus)
    const atFirst = !points || y <= points[0] + 3;
    const atLast = !points || y >= lastStep - 3;
    for (const arrow of document.querySelectorAll<HTMLElement>("[data-story-step]")) {
      const off = String(Number(arrow.dataset.storyStep) > 0 ? atLast : atFirst);
      if (arrow.getAttribute("aria-disabled") !== off) arrow.setAttribute("aria-disabled", off);
    }
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  onGlide = update;
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const arrow = target?.closest<HTMLElement>("[data-story-step]");
    if (arrow && stepping()) arrowStep(Number(arrow.dataset.storyStep));
    const leave = target?.closest<HTMLElement>("[data-story-leave]");
    if (leave) leaveStory(leave, Number(leave.dataset.storyLeave));
  });
  queue();
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
    "html[data-overlay-open] .story-steps-nav{display:none}" +
    // a story's dots between its previous and next arrows (StoryDotsNav.astro); the arrows only while stepping is on
    ".story-dots-nav{display:flex;align-items:center;gap:8px}" +
    ".story-step-arrow{display:none;place-items:center;width:30px;height:30px;margin:0;padding:0;border:0;border-radius:50%;background:transparent;color:inherit;opacity:.72;cursor:pointer;appearance:none;transition:opacity .25s,background-color .25s}" +
    "html.story-snap-strict .story-step-arrow{display:grid}" +
    ".story-step-arrow svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}" +
    "@media(hover:hover){.story-step-arrow:hover{opacity:1;background-color:color-mix(in srgb,currentColor 12%,transparent)}}" +
    ".story-step-arrow[aria-disabled=true]{opacity:.22;cursor:default;background-color:transparent}" +
    ".story-step-arrow:focus-visible{outline:2px solid #d6ef8c;outline-offset:2px;opacity:1}" +
    // the dots: clickable, with a taller hit area than the dots themselves, swelling with --dock (dockDots)
    ".story-dots-nav{position:relative}" +
    "html.story-snap-strict .story-dots-nav ol{cursor:pointer;padding-block:10px!important;margin-block:-10px!important}" +
    ".story-dots-nav li{scale:calc(1 + 1.5 * var(--dock,0));translate:var(--dock-x,0px) 0}" +
    ".story-dot-tip{position:absolute;left:0;bottom:calc(100% + 10px);translate:-50% 4px;display:flex;flex-direction:column;gap:2px;max-width:280px;padding:7px 11px;border:1px solid #ffffff24;border-radius:9px;background:#1d2433f2;color:#f5f6f0;font:500 12px/1.35 Inter,Arial,sans-serif;text-align:center;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .18s,translate .18s;box-shadow:0 6px 18px #050b1b40}" +
    ".story-dot-tip small{font-size:10.5px;font-weight:500;letter-spacing:.02em;color:#aeb6c6}" +
    ".story-dot-tip.is-on{opacity:1;translate:-50% 0}" +
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
    // a story came half into view while the finger was still on the screen: take over now it's lifted, onto its first
    // step, also when the finger has dragged the page a little past it (short of the second step: settling would
    // otherwise carry it on to the second, skipping the first)
    if (wasNative && entering !== null) {
      const [first, second] = stories[entering] ?? [];
      entering = null;
      const y = window.scrollY;
      if (first !== undefined && velocity > 0 && y < first - 3) {
        glideTo(first, Math.min(3, velocity), FIRST_STEP_PACE);
        return;
      }
      if (first !== undefined && y >= first - 3 && (second === undefined || y < second - 3)) {
        glideTo(first);
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
      // (or already a little past its first step, as a fast momentum scroll can be in one event: back onto it)
      const crossed = entries.findIndex((entry, i) => before < entry && y >= entry && y < (stories[i][1] ?? stories[i][0]) - 3);
      if (crossed < 0) return;
      if (mode === "native") {
        entering = crossed; // the finger is still down
        return;
      }
      const first = stories[crossed][0];
      glideTo(first, y < first ? Math.min(3, Math.max(0, velocity)) : 0, FIRST_STEP_PACE);
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
      pace: Array.isArray(result) ? 1 : result.pace ?? 1,
      entryMs: Array.isArray(result) ? undefined : result.entryMs,
      quick: Array.isArray(result) ? undefined : result.quick,
      dots: Array.isArray(result) ? null : result.dots ?? null,
      leads: Array.isArray(result) ? undefined : result.leads,
      hintLow: Array.isArray(result) ? false : result.hintLow ?? false
    };
  });
  const lists = read.map((story) => story.list);
  const kept = read.filter((story) => story.list.length > 1);
  stories = kept.map((story) => story.list);
  paces = kept.map((story) => story.pace);
  entryMs = kept.map((story) => story.entryMs);
  quicks = kept.flatMap((story) => (story.quick ? [story.quick] : []));
  dotLists = kept.map((story) => story.dots);
  leadLists = kept.map((story) => story.leads);
  hintLows = kept.map((story) => story.hintLow);
  for (const list of dotLists) {
    const nav = list?.closest<HTMLElement>(".story-dots-nav");
    if (nav) dockDots(nav);
  }
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

/**
 * Glides the page to `target` (a story's step) the way a swipe would; a menu link uses it, since the browser's own
 * smooth scroll can pause on the way and be settled onto a step next to the one it was going for.
 */
export function glideToStep(target: number) {
  if (typeof window === "undefined") return;
  if (!stepping()) {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  glideTo(target, 0, 1, CLICK_KICK);
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
