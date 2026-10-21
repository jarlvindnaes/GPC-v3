// Full stories that take over the page. Each big scroll story waits, hidden, behind a short section (its teaser):
// "Experience the full story" ([data-story-open="id"]) shows the story ([data-story-takeover="id"]) as the whole page,
// with everything else (site header, other sections, footer) out of the way, and a ✕ at the top right. It is not an
// overlay: the story is the page, scrolling and pinning as it always does (nothing fixed near the bottom of the screen,
// iOS Safari). ✕, Esc, the browser's back button, or the story's « and » close it, back at its teaser.
// Links to a story's section (#product-model, #supply-chain, #benefits) land on its teaser, where the reader opens it; a
// link into a story (one of its chapters' ids) opens it there.

import { firstStepWithin, glideToStep, lastStepWithin, refreshSnapPoints } from "./storySnap";

let openId: string | null = null;
let returnTo: { y: number; focus: HTMLElement | null } | null = null;
let close: HTMLButtonElement | null = null;
let pushed = false; // (opening added a history step, which closing takes back)
let afterBack: ((teaser: HTMLElement | null) => void) | null = null; // (how to close once that step is back)
let keyed = false; // (the last input was a key, not a pointer)

const storyFor = (id: string) => document.querySelector<HTMLElement>(`[data-story-takeover="${id}"]`);
const teaserFor = (id: string) => document.querySelector<HTMLElement>(`[data-story-teaser="${id}"]`);

/** Opens a story full screen, at its top (or at an element inside it). */
export function openStory(id: string, options: { at?: HTMLElement | null; push?: boolean } = {}) {
  const story = storyFor(id);
  if (!story || openId === id) return;
  if (openId) shut(false);
  start();
  returnTo = { y: window.scrollY, focus: document.activeElement instanceof HTMLElement ? document.activeElement : null };
  openId = id;
  story.classList.add("is-taken-over");
  document.documentElement.dataset.storyOpen = id;
  close!.hidden = false;
  close!.setAttribute("aria-label", `Close ${story.dataset.storyName ?? "the story"}`);
  // the stories measure themselves from the page as it is now laid out
  window.dispatchEvent(new Event("resize"));
  refreshSnapPoints();
  // (the history step first, so the page's own place, at the teaser, is the one the browser keeps for it)
  pushed = options.push !== false;
  if (pushed) history.pushState({ ...(history.state ?? {}), storyTakeover: id }, "");
  // from its top, gliding into its first step (so its opening animation plays, in the story's own entry time), or
  // where a link pointed
  const target = options.at ?? story;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
  const first = options.at ? undefined : firstStepWithin(story);
  if (first !== undefined) glideToStep(first);
  close!.focus({ preventScroll: true });
}

/** Closes the open story, back at its teaser (and, with history, one step back). */
export function closeStory(then?: (teaser: HTMLElement | null) => void) {
  if (!openId) return;
  if (pushed) {
    afterBack = then ?? null;
    history.back(); // (popstate closes it)
  } else shut(true, then);
}

function shut(restore: boolean, then?: ((teaser: HTMLElement | null) => void) | null) {
  const id = openId;
  if (!id) return;
  openId = null;
  pushed = false;
  storyFor(id)?.classList.remove("is-taken-over");
  delete document.documentElement.dataset.storyOpen;
  if (close) {
    close.hidden = true;
    close.classList.remove("is-end");
  }
  window.dispatchEvent(new Event("resize"));
  refreshSnapPoints();
  const teaser = teaserFor(id);
  const back = returnTo;
  returnTo = null;
  // (on the next frame: after the browser's own scroll restoring, when closed through the history)
  requestAnimationFrame(() => {
    if (then) then(teaser);
    else if (restore) {
      // back where the story was opened from (its teaser), and the focus with it
      const y = teaser ? teaser.getBoundingClientRect().top + window.scrollY : (back?.y ?? 0);
      window.scrollTo({ top: y, behavior: "instant" });
      // (its focus ring only for keyboard users: a click on the ✕ leaves no ring on the teaser's button)
      (teaser?.querySelector<HTMLElement>("[data-story-open]") ?? back?.focus)?.focus({ preventScroll: true, focusVisible: keyed } as FocusOptions);
    }
  });
}

let started = false;
function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const style = document.createElement("style");
  style.textContent =
    // a story waits hidden until it is opened; open, it is the page: the rest steps aside, the site header too (and
    // the room the stories keep for it, --sh-h)
    "[data-story-takeover]:not(.is-taken-over){display:none!important}" +
    "html[data-story-open] main>:not(.is-taken-over),html[data-story-open] :is([data-site-header],body>footer,.site-footer){display:none!important}" +
    "html[data-story-open]{--sh-h:0px}" +
    // the ✕, top right, level with the story's "Swipe ↓" hint (24px down, 40px tall), which moves to its left; a story
    // with a bar along its top (the homepage story's chapter tabs) puts it below that with --story-close-top
    ".story-takeover-close{position:fixed;z-index:60;top:var(--story-close-top,22px);right:16px;display:grid;place-items:center;width:44px;height:44px;margin:0;padding:0;border:1px solid #ffffff2e;border-radius:50%;background:#1d2433e6;color:#f5f6f0;cursor:pointer;box-shadow:0 4px 14px #050b1b33;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}" +
    ".story-takeover-close[hidden]{display:none}" +
    "html[data-story-open] .story-steps-nav>.story-steps-hint{right:72px}" +
    // (a story opened full screen leaves through its ✕: no « and » to the sections around it)
    ".is-taken-over [data-story-leave]{display:none!important}" +
    ".story-takeover-close svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}" +
    ".story-takeover-close:hover{background:#2a3347}" +
    // at the story's end the ✕ lights up (the ring it has when focused, breathing gently): the way out is here
    ".story-takeover-close.is-end{outline:2px solid #d6ef8c;outline-offset:3px;animation:story-close-glow 2.4s ease-in-out infinite}" +
    "@keyframes story-close-glow{50%{box-shadow:0 0 20px 6px #d6ef8c40}}" +
    "@media(prefers-reduced-motion:reduce){.story-takeover-close.is-end{animation:none}}" +
    ".story-takeover-close:focus-visible{outline:2px solid #d6ef8c;outline-offset:3px}";
  document.head.append(style);
  close = document.createElement("button");
  close.type = "button";
  close.className = "story-takeover-close";
  close.hidden = true;
  close.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>';
  close.addEventListener("click", () => closeStory());
  document.body.append(close);
  // the open story's end: its last step (or, without steps, its bottom on screen)
  let endQueued = false;
  const markEnd = () => {
    endQueued = false;
    const story = openId ? storyFor(openId) : null;
    if (!story || !close) return close?.classList.remove("is-end");
    const last = lastStepWithin(story);
    const end = last !== undefined ? window.scrollY >= last - 3 : story.getBoundingClientRect().bottom <= window.innerHeight + 4;
    close.classList.toggle("is-end", end);
  };
  window.addEventListener("scroll", () => { if (!endQueued) { endQueued = true; requestAnimationFrame(markEnd); } }, { passive: true });
  document.addEventListener("pointerdown", () => (keyed = false), true);
  document.addEventListener("keydown", (event) => {
    keyed = true;
    if (event.key === "Escape" && openId && !document.documentElement.dataset.overlayOpen) closeStory();
  });
  window.addEventListener("popstate", (event) => {
    const id = (event.state as { storyTakeover?: string } | null)?.storyTakeover;
    if (id) {
      openStory(id, { push: false });
      pushed = true; // (forward again: its step is back in the history)
      return;
    }
    const then = afterBack;
    afterBack = null;
    shut(true, then);
  });
  // the story's « and » (StoryDotsNav): out of the story, past its teaser (») or to just before it («)
  window.addEventListener(
    "click",
    (event) => {
      const leave = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-story-leave]") : null;
      if (!leave || !openId || !leave.closest(".is-taken-over")) return;
      event.stopPropagation();
      const direction = Number(leave.dataset.storyLeave);
      closeStory((teaser) => {
        if (!teaser) return;
        const box = teaser.getBoundingClientRect();
        const y = direction > 0 ? box.bottom + window.scrollY : Math.max(0, box.top + window.scrollY - window.innerHeight);
        window.scrollTo({ top: y, behavior: "instant" });
      });
    },
    true
  );
}

/** Wires the teasers' buttons, and opens a story a link points into. */
export function initStoryTakeovers() {
  if (typeof window === "undefined") return;
  start();
  document.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-story-open]") : null;
    if (!button) return;
    event.preventDefault();
    openStory(button.dataset.storyOpen!);
  });
  // a link into a story (on arrival, or within the page): open it there
  const fromHash = () => {
    const hash = location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
    const target = hash ? document.getElementById(hash) : null;
    const story = target?.closest<HTMLElement>("[data-story-takeover]");
    if (story && target) openStory(story.dataset.storyTakeover!, { at: target, push: false });
  };
  fromHash();
  window.addEventListener("hashchange", fromHash);
  // back to this page through the history, into the step a story was open in: open it again, once the page has
  // loaded (its steps measured); a reload starts from the page itself
  const back = (history.state as { storyTakeover?: string } | null)?.storyTakeover;
  const backForward = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type === "back_forward";
  if (back && !backForward) {
    const { storyTakeover: _, ...rest } = history.state ?? {};
    history.replaceState(rest, "");
  } else if (back && storyFor(back)) {
    window.addEventListener(
      "load",
      () => {
        if (openId) return;
        openStory(back, { push: false });
        pushed = true;
      },
      { once: true }
    );
  }
}
