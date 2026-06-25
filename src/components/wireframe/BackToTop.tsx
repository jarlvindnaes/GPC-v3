import { useEffect, useState } from "react";

// Back-to-top button, ported from the main site's BackToTop. Lightweight (React only — no motion,
// no icon library, no class helper — so the island hydrates instantly): appears past 300px of
// scroll via a CSS fade, and smooth-scrolls to the top on click.

const BASE_CLASS =
  "group fixed right-6 bottom-20 z-40 flex h-12 w-12 items-center justify-center rounded-full " +
  "border border-slate-200 bg-white text-slate-900 shadow-lg transition-all duration-300 " +
  "hover:shadow-xl sm:right-8 sm:bottom-8";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stateClass = isVisible ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0";

  return (
    <button type="button" onClick={scrollToTop} aria-label="Back to top" className={`${BASE_CLASS} ${stateClass}`}>
      <svg
        className="h-6 w-6 transition-transform group-hover:-translate-y-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={true}
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
