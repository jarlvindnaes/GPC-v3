import { useCallback, useRef } from "react";

/**
 * RAF-throttled per-element mouse gradient tracking.
 * Drop-in replacement for useGradientAngle in WebsiteCard.
 * Sets --mouse-x / --mouse-y CSS variables on the ref element.
 */
export function useElementGradient() {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);
  const pendingPos = useRef<{ clientX: number; clientY: number } | null>(null);

  const flush = useCallback(() => {
    rafId.current = 0;
    const el = ref.current;
    const pos = pendingPos.current;
    if (!el || !pos) {
      return;
    }
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${((pos.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--mouse-y", `${((pos.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      pendingPos.current = { clientX: event.clientX, clientY: event.clientY };
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(flush);
      }
    },
    [flush]
  );

  const onMouseLeave = useCallback(() => {
    pendingPos.current = null;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
    ref.current?.style.removeProperty("--mouse-x");
    ref.current?.style.removeProperty("--mouse-y");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
