import { useCallback, useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
  active: boolean;
}

const isTouchDevice =
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/**
 * RAF-throttled mouse tracking for a section element.
 *
 * - mouseRef: updated synchronously on every mousemove using cached section rect.
 *   Safe to read from canvas RAF loops (always current, zero DOM cost).
 * - CSS variable targets: elements registered via addCssTarget receive
 *   --mouse-x / --mouse-y updates batched into a single RAF callback.
 * - Section and target rects are cached and refreshed on scroll/resize only.
 *
 * On touch devices, no listeners are attached and mouseRef.active stays false.
 */
export function useSectionMouse(sectionRef: React.RefObject<HTMLElement | null>) {
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0, active: false });
  const cssTargets = useRef<Set<HTMLElement>>(new Set());
  const pendingClientPos = useRef<{ clientX: number; clientY: number } | null>(null);
  const rafId = useRef(0);
  const sectionRect = useRef<DOMRect | null>(null);
  const targetRects = useRef<Map<HTMLElement, DOMRect>>(new Map());

  const refreshRects = useCallback(() => {
    if (isTouchDevice) return;
    const section = sectionRef.current;
    if (section) {
      sectionRect.current = section.getBoundingClientRect();
    }
    for (const el of cssTargets.current) {
      targetRects.current.set(el, el.getBoundingClientRect());
    }
  }, [sectionRef]);

  const addCssTarget = useCallback((el: HTMLElement | null) => {
    if (!el || isTouchDevice) {
      return;
    }
    cssTargets.current.add(el);
    targetRects.current.set(el, el.getBoundingClientRect());
  }, []);

  const removeCssTarget = useCallback((el: HTMLElement) => {
    cssTargets.current.delete(el);
    targetRects.current.delete(el);
  }, []);

  useEffect(() => {
    // Skip all mouse tracking on touch devices
    if (isTouchDevice) return;

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    sectionRect.current = section.getBoundingClientRect();

    const onScrollOrResize = () => refreshRects();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    const flush = () => {
      rafId.current = 0;
      const pos = pendingClientPos.current;
      if (!pos) {
        return;
      }

      for (const el of cssTargets.current) {
        const rect = targetRects.current.get(el);
        if (!rect) {
          continue;
        }
        const xPct = ((pos.clientX - rect.left) / rect.width) * 100;
        const yPct = ((pos.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mouse-x", `${xPct}%`);
        el.style.setProperty("--mouse-y", `${yPct}%`);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      pendingClientPos.current = { clientX: event.clientX, clientY: event.clientY };

      // Synchronous mouseRef update using cached rect (zero DOM cost)
      const rect = sectionRect.current;
      if (rect) {
        mouseRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          active: true
        };
      }

      // Batch CSS var writes to next frame
      if (cssTargets.current.size > 0 && !rafId.current) {
        rafId.current = requestAnimationFrame(flush);
      }
    };

    const onMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
      pendingClientPos.current = null;
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
      for (const el of cssTargets.current) {
        el.style.removeProperty("--mouse-x");
        el.style.removeProperty("--mouse-y");
      }
    };

    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);

    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [sectionRef, refreshRects]);

  return { mouseRef, addCssTarget, removeCssTarget };
}
