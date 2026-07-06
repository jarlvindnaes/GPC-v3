import { useEffect, useRef, useState } from "react";

/**
 * Detects if the device is primarily touch-based (no mouse).
 * Returns a stable boolean after first interaction, and a ref for use in RAF loops.
 *
 * Uses matchMedia for initial check, then listens for first pointer event to confirm.
 */
export function useIsTouchDevice() {
  const [isTouch] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);
  const isTouchRef = useRef(isTouch);

  useEffect(() => {
    isTouchRef.current = isTouch;
  }, [isTouch]);

  return { isTouch, isTouchRef };
}
