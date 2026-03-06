import { useEffect, useRef } from "react";

export function useIsNearViewport(
  elementReference: React.RefObject<HTMLElement | null>,
  rootMargin = "500px"
): React.RefObject<boolean> {
  const isNearReference = useRef(true);

  useEffect(() => {
    const element = elementReference.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearReference.current = entry.isIntersecting;
      },
      { rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementReference, rootMargin]);

  return isNearReference;
}
