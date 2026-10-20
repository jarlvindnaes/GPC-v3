// Homepage islands that load their code (three.js, models, the map data) only when they're about to be seen, not
// at page load: the 3D passport phone and the supply-chain globe. They hydrate `client:only` as before, so nothing
// is rendered until they load either way; the wrappers just move that moment later.
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// the page blur behind the passport, also wanted behind its loader (which shows before the passport has arrived)
import "./wireframe/passport-overlay.css";

const PassportPhone = lazy(() => import("./wireframe/PassportPhone").then((m) => ({ default: m.PassportPhone })));
const SupplyChainGlobe = lazy(() => import("./SupplyChainGlobe").then((m) => ({ default: m.SupplyChainGlobe })));

/**
 * True once the sentinel (or `watch`, a selector for another element) comes within `margin` of the screen, or, with
 * `idle`, once the page has loaded and the browser is idle, whichever comes first (then it stays true).
 */
function useNearScreen(
  margin: string,
  { watch, idle = false, idleDelay = 0 }: { watch?: string; idle?: boolean; idleDelay?: number } = {}
) {
  const ref = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return;
    const watched = watch ? document.querySelector<HTMLElement>(watch) : null;
    // (a watched element that isn't laid out, e.g. the story's scroll markers on a stacked layout, can't be observed)
    const el = watched && watched.offsetParent !== null ? watched : ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setNear(true);
    }, { rootMargin: margin });
    io.observe(el);
    let idleId = 0;
    let delayId = 0;
    const whenIdle = () => {
      idleId = "requestIdleCallback" in window
        ? window.requestIdleCallback(() => setNear(true), { timeout: 3000 })
        : Number(globalThis.setTimeout(() => setNear(true), 1200));
    };
    const startIdle = () => {
      if (idleDelay) delayId = Number(globalThis.setTimeout(whenIdle, idleDelay));
      else whenIdle();
    };
    if (idle) {
      if (document.readyState === "complete") startIdle();
      else window.addEventListener("load", startIdle, { once: true });
    }
    return () => {
      io.disconnect();
      window.removeEventListener("load", startIdle);
      if (idleId) ("cancelIdleCallback" in window ? window.cancelIdleCallback(idleId) : globalThis.clearTimeout(idleId));
      if (delayId) globalThis.clearTimeout(delayId);
    };
  }, [margin, near, watch, idle, idleDelay]);
  return [ref, near, setNear] as const;
}

// (a zero-height marker where the island sits, so its position can be watched before it exists)
const sentinel = { display: "block", height: 0 } as const;

/** Marks the passport as mounted (and so listening for "passport:open"), then re-sends an open asked for meanwhile. */
function OnPassportMounted({ onMounted }: { onMounted: () => void }) {
  useEffect(onMounted, [onMounted]);
  return null;
}

export function LazyPassportPhone() {
  // Loads in the background once the page has loaded and the browser is idle (a moment after the hero and the globe),
  // so it's usually ready before anyone asks; or sooner, as the chapter before it comes up (the pinned story lays
  // every chapter over the same spot, so its own position says nothing), or when asked to open.
  const [ref, near, setNear] = useNearScreen("100% 0px", {
    watch: '[data-story-marker="analyse-improve"]',
    idle: true,
    idleDelay: 1500
  });
  const [mounted, setMounted] = useState(false);
  const [waiting, setWaiting] = useState(false); // asked to open before it was ready: the loader shows
  const isMounted = useRef(false); // (set at once, before the re-sent open below reaches this listener)
  useEffect(() => {
    if (mounted) return;
    const open = () => {
      if (isMounted.current) return;
      setWaiting(true);
      setNear(true);
    };
    window.addEventListener("passport:open", open);
    return () => window.removeEventListener("passport:open", open);
  }, [mounted, setNear]);
  // while waiting: the page blurs as it will behind the passport, and Escape or a click outside cancels
  useEffect(() => {
    if (!waiting) return;
    const root = document.documentElement;
    root.dataset.overlayOpen = "true";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWaiting(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (!document.querySelector(".passport-overlay[role='dialog']")) delete root.dataset.overlayOpen;
    };
  }, [waiting]);
  const onMounted = useRef(() => {});
  const handleMounted = useCallback(() => onMounted.current(), []);
  onMounted.current = () => {
    isMounted.current = true;
    setMounted(true);
    if (waiting) {
      setWaiting(false);
      window.dispatchEvent(new CustomEvent("passport:open"));
    }
  };
  return (
    <>
      <span ref={ref} style={sentinel} aria-hidden="true" />
      {near && (
        <Suspense fallback={null}>
          <PassportPhone />
          <OnPassportMounted onMounted={handleMounted} />
        </Suspense>
      )}
      {waiting &&
        createPortal(
          <div className="passport-overlay passport-waiting" onClick={() => setWaiting(false)}>
            <div className="passport-waiting-card" role="status">
              <span className="passport-waiting-spinner" aria-hidden="true" />
              Loading the passport …
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export function LazySupplyChainGlobe({ size }: { size?: number }) {
  // the story's first chapter, just below the hero: after the page has loaded (the hero first), or sooner if reached
  const [ref, near] = useNearScreen("0px", { idle: true });
  return (
    <>
      <span ref={ref} style={sentinel} aria-hidden="true" />
      {near && (
        <Suspense fallback={null}>
          <SupplyChainGlobe size={size} />
        </Suspense>
      )}
    </>
  );
}
