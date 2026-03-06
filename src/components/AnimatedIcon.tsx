import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useCallback, useEffect, useRef } from "react";

function useCurrentColor(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) {
      return;
    }
    svg.querySelectorAll("[fill]").forEach((element) => {
      element.setAttribute("fill", "currentColor");
    });
    svg.querySelectorAll("[stroke]").forEach((element) => {
      element.setAttribute("stroke", "currentColor");
    });
  });
}

export function AnimatedIcon({
  animationData,
  className,
  loop = true,
  autoplay = true,
  playOnHover = false
}: {
  animationData: unknown;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  playOnHover?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  useCurrentColor(containerRef);

  const handleMouseEnter = useCallback(() => {
    const animation = lottieRef.current?.animationItem;
    if (animation) {
      animation.loop = loop;
      animation.goToAndPlay(0, true);
    }
  }, [loop]);

  const handleMouseLeave = useCallback(() => {
    const animation = lottieRef.current?.animationItem;
    if (animation) {
      animation.loop = false;
    }
  }, []);

  useEffect(() => {
    if (!playOnHover || !containerRef.current) {
      return;
    }
    const trigger = containerRef.current.closest("[data-hover-trigger]") ?? containerRef.current;
    trigger.addEventListener("mouseenter", handleMouseEnter);
    trigger.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      trigger.removeEventListener("mouseenter", handleMouseEnter);
      trigger.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [playOnHover, handleMouseEnter, handleMouseLeave]);

  const shouldAutoplay = playOnHover ? false : autoplay;

  return (
    <div ref={containerRef} className={className}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={shouldAutoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
