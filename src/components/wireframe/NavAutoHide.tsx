import { useEffect } from "react";

// Behavior-only island: auto-hides the wireframe top nav on scroll-down and reveals it on a
// deliberate scroll-up (ported from the main site's Navbar useScrollDirection). Renders nothing;
// toggles the `nav--hidden` class on the existing `.nav` element. Mount once per page via client:load.
export function NavAutoHide() {
  useEffect(() => {
    const nav = document.querySelector(".nav");
    if (!nav) {
      return;
    }

    let lastY = window.scrollY;
    let anchor = window.scrollY;
    let direction: "up" | "down" = "down";
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const newDirection = y > lastY ? "down" : "up";

      if (newDirection !== direction) {
        anchor = y;
        direction = newDirection;
      }

      if (y <= 64) {
        nav.classList.remove("nav--hidden");
      } else if (newDirection === "down" && y - anchor > 10) {
        nav.classList.add("nav--hidden");
      } else if (newDirection === "up" && anchor - y > 40) {
        nav.classList.remove("nav--hidden");
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      nav.classList.remove("nav--hidden");
    };
  }, []);

  return null;
}
