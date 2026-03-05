import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const SCREENSHOTS = [
  {
    src: `${import.meta.env.BASE_URL}screenshots/product-studio_crop.png`,
    label: "Product Studio",
    description: "3D model ingestion & component breakdown"
  },
  {
    src: `${import.meta.env.BASE_URL}screenshots/supply-chain_crop.png`,
    label: "Supply Chain Map",
    description: "Global transport routes & logistics tracking"
  }
];

export function ScreenshotCarousel() {
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive((i) => (i + 1) % SCREENSHOTS.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border border-slate-200/60 bg-brand-deep shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)]"
    >
      <div className="flex h-11 items-center justify-between border-brand-dark/30 border-b bg-brand-dark/50 px-5">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/40"></div>
          <div className="h-3 w-3 rounded-full bg-amber-500/40"></div>
          <div className="h-3 w-3 rounded-full bg-emerald-500/40"></div>
        </div>
        <div className="mx-auto max-w-[85%] flex-1 sm:max-w-md">
          <div className="flex items-center gap-2 rounded-lg bg-brand-dark/40 px-3 py-1">
            <svg
              className="h-3 w-3 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <title>Secure connection icon</title>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="font-medium text-[11px] text-slate-400">getproductconnect.com</span>
          </div>
        </div>
        <div className="w-16" />
      </div>

      <div className="relative aspect-[16/9.5] overflow-hidden bg-brand-deep">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={SCREENSHOTS[active].src}
            alt={SCREENSHOTS[active].label}
            className="absolute inset-0 h-full w-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-28 bg-gradient-to-t from-slate-900/90 to-transparent" />

        <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between px-6 pb-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold text-sm text-white">{SCREENSHOTS[active].label}</p>
              <p className="mt-0.5 text-slate-400 text-xs">{SCREENSHOTS[active].description}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {SCREENSHOTS.map((screenshot, screenshotIndex) => (
              <button
                type="button"
                key={screenshot.label}
                aria-label={`Go to ${screenshot.label}`}
                onClick={() => setActive(screenshotIndex)}
                className={`h-2.5 rounded-full transition-all duration-300 ${screenshotIndex === active ? "w-6 bg-brand" : "w-2.5 bg-slate-600 hover:bg-slate-500"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
