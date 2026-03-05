import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { THEME_NAMES, THEMES, type ThemeName, useTheme } from "../theme";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerReference.current && !containerReference.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentTheme = THEMES[theme];

  return (
    <div ref={containerReference} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Theme: ${currentTheme.label}`}
        className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm transition-colors hover:border-brand/30 hover:bg-brand-surface/50"
      >
        <span
          className="h-3.5 w-3.5 rounded-full shadow-sm ring-1 ring-black/10"
          style={{ backgroundColor: currentTheme.swatch }}
        />
        <span className="font-medium text-brand-text">{currentTheme.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-brand-text transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          >
            {THEME_NAMES.map((themeName: ThemeName) => {
              const definition = THEMES[themeName];
              const isActive = themeName === theme;
              return (
                <button
                  key={themeName}
                  type="button"
                  onClick={() => {
                    setTheme(themeName);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${isActive ? "bg-brand-surface font-medium text-brand-dark" : "text-brand-text hover:bg-slate-50"}`}
                >
                  <span
                    className="h-4 w-4 rounded-full shadow-sm ring-1 ring-black/10"
                    style={{ backgroundColor: definition.swatch }}
                  />
                  {definition.label}
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
