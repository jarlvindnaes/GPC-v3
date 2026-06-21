import { ChevronRight, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function useScrollDirection() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const anchor = useRef(0);
  const direction = useRef<"up" | "down">("down");
  const ticking = useRef(false);

  const update = useCallback(() => {
    const y = window.scrollY;
    const newDir = y > lastY.current ? "down" : "up";

    // When direction changes, set an anchor point
    if (newDir !== direction.current) {
      anchor.current = y;
      direction.current = newDir;
    }

    if (y <= 64) {
      setHidden(false);
    } else if (newDir === "down" && y - anchor.current > 10) {
      setHidden(true);
    } else if (newDir === "up" && anchor.current - y > 40) {
      // Require 40px of deliberate upward scrolling to reappear
      setHidden(false);
    }

    lastY.current = y;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [update]);

  return hidden;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const hidden = useScrollDirection();

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 border-slate-200/50 border-b bg-white/70 backdrop-blur-xl transition-transform duration-300 ${hidden && !isOpen ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-deep transition-colors duration-300 group-hover:bg-brand">
              <span className="font-bold text-sm text-white">PC</span>
            </div>
            <span className="font-semibold text-brand-dark text-lg tracking-tight transition-colors duration-300 group-hover:text-brand">
              Product Connect
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/platform"
              className="group relative font-medium text-brand-text text-sm transition-colors hover:text-brand"
            >
              Platform
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/dpp"
              className="group relative font-medium text-brand-text text-sm transition-colors hover:text-brand"
            >
              DPP
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/pricing"
              className="group relative font-medium text-brand-text text-sm transition-colors hover:text-brand"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="group relative font-medium text-brand-text text-sm transition-colors hover:text-brand"
            >
              About
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand transition-all group-hover:w-full"></span>
            </Link>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link to="/login" className="font-medium text-brand-text text-sm transition-colors hover:text-brand-dark">
              Sign in
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-1 rounded-full bg-brand-deep px-5 py-2.5 font-medium text-sm text-white shadow-sm transition-all hover:scale-105 hover:bg-brand-dark hover:shadow-md active:scale-95"
            >
              Start now <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              className="-mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center p-3 text-brand-text transition-colors hover:text-brand-dark"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 border-slate-200 border-b bg-white px-4 py-6 shadow-xl md:hidden"
        >
          <Link
            to="/platform"
            onClick={() => setIsOpen(false)}
            className="font-medium text-brand-text text-lg hover:text-brand"
          >
            Platform
          </Link>
          <Link
            to="/dpp"
            onClick={() => setIsOpen(false)}
            className="font-medium text-brand-text text-lg hover:text-brand"
          >
            DPP
          </Link>
          <Link
            to="/pricing"
            onClick={() => setIsOpen(false)}
            className="font-medium text-brand-text text-lg hover:text-brand"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="font-medium text-brand-text text-lg hover:text-brand"
          >
            About
          </Link>
          <hr className="my-2 border-slate-100" />
          <Link to="/login" onClick={() => setIsOpen(false)} className="font-medium text-brand-text text-lg">
            Sign in
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="rounded-2xl bg-brand-deep px-4 py-4 text-center font-medium text-lg text-white shadow-lg active:scale-[0.98]"
          >
            Get Started
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
