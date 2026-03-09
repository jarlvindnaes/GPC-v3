import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { WebsiteButton } from "./WebsiteButton";

const visualGradientClassNames: Record<string, string> = {
  slate: "bg-radial-dark-sun-corner",
  emerald: "bg-radial-accent-sun-corner",
  indigo: "bg-radial-emerald-sun-corner",
  cyan: "bg-radial-dark-sun-corner",
  rose: "bg-radial-accent-sun-corner",
  blue: "bg-radial-green-sun-corner"
};

const checkIconClassNames: Record<string, string> = {
  slate: "text-slate-500",
  emerald: "text-[var(--color-brand-emerald)]",
  indigo: "text-[var(--color-brand-emerald)]",
  cyan: "text-[var(--color-brand)]",
  rose: "text-[var(--color-brand-violet)]",
  blue: "text-[var(--color-brand-cyan)]"
};

interface WebsiteCardDialogProps {
  identifier: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  visual: ReactNode;
  color: string;
  description: string;
  benefits: string[];
  badge?: string;
  badgeClassName?: string;
  fillVisual?: boolean;
  fadeVisualOnResize?: boolean;
  callToActionLabel?: string;
  onCallToActionPress?: () => void;
}

export function WebsiteCardDialog({
  identifier,
  isOpen,
  onClose,
  title,
  visual,
  color,
  description,
  benefits,
  badge,
  badgeClassName,
  fillVisual = false,
  fadeVisualOnResize = false,
  callToActionLabel,
  onCallToActionPress
}: WebsiteCardDialogProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              layoutId={`card-${identifier}`}
              onLayoutAnimationStart={() => {
                if (fadeVisualOnResize && visualRef.current) {
                  visualRef.current.style.transition = "none";
                  visualRef.current.style.opacity = "0";
                }
              }}
              onLayoutAnimationComplete={() => {
                window.dispatchEvent(new Event("resize"));
                requestAnimationFrame(() => {
                  if (fadeVisualOnResize && visualRef.current) {
                    visualRef.current.style.transition = "opacity 0.5s ease";
                    visualRef.current.style.opacity = "1";
                  }
                });
              }}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="pointer-events-auto flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl md:flex-row"
            >
              <div
                className={`relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-t-2xl border-slate-200 border-b md:min-h-[400px] md:w-1/2 md:rounded-t-none md:rounded-l-2xl md:border-r md:border-b-0 ${fillVisual ? "" : "p-6 sm:p-8 md:p-12"} ${visualGradientClassNames[color] ?? "bg-brand-surface"}`}
              >
                {fillVisual ? (
                  <div ref={fadeVisualOnResize ? visualRef : undefined} className="h-full w-full">
                    {visual}
                  </div>
                ) : (
                  <div className="w-full max-w-sm scale-125 transform md:scale-150">{visual}</div>
                )}
              </div>

              <div className="relative flex flex-col p-5 sm:p-8 md:w-1/2 md:p-12">
                <WebsiteButton
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close feature details"
                  className="absolute top-6 right-6 h-10 w-10 bg-slate-100 hover:bg-slate-200"
                >
                  <X className="h-5 w-5 text-brand-text" />
                </WebsiteButton>

                {badge && (
                  <div className="mb-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider ${badgeClassName ?? "border-brand-accent/20 bg-brand-accent/10 text-brand-accent"}`}
                    >
                      {badge}
                    </span>
                  </div>
                )}
                <motion.div layoutId={`title-${identifier}`}>
                  <h3 className="mb-6 pr-12 font-display font-semibold text-2xl text-brand-darkest sm:text-3xl">
                    {title}
                  </h3>
                </motion.div>

                <p className="mb-8 text-brand-text text-lg leading-relaxed">{description}</p>

                <div className="mb-12 space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className={`h-6 w-6 shrink-0 ${checkIconClassNames[color] ?? "text-brand"}`} />
                      <span className="font-medium text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-slate-100 border-t pt-8">
                  <WebsiteButton
                    icon={ArrowUpRight}
                    size="small"
                    onClick={onCallToActionPress}
                    className="w-full rounded-xl py-4 text-lg"
                  >
                    {callToActionLabel ?? `Explore ${title}`}
                  </WebsiteButton>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
