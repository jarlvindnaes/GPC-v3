import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface WebsiteCardDialogProps {
  identifier: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  visual: ReactNode;
  color: string;
  description: string;
  benefits: string[];
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
  callToActionLabel,
  onCallToActionPress
}: WebsiteCardDialogProps) {
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
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="pointer-events-auto flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl md:flex-row"
            >
              <motion.div
                layoutId={`visual-${identifier}`}
                className={`flex items-center justify-center border-slate-100 border-b bg-gradient-to-br from-${color}-50 to-${color}-100/50 p-6 sm:p-8 md:w-1/2 md:border-r md:border-b-0 md:p-12`}
              >
                <div className="w-full max-w-sm scale-125 transform md:scale-150">{visual}</div>
              </motion.div>

              <div className="relative flex flex-col p-5 sm:p-8 md:w-1/2 md:p-12">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close feature details"
                  className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>

                <motion.div layoutId={`title-${identifier}`}>
                  <h3 className="mb-6 pr-12 font-display font-semibold text-2xl text-slate-900 sm:text-3xl">{title}</h3>
                </motion.div>

                <p className="mb-8 text-lg text-slate-600 leading-relaxed">{description}</p>

                <div className="mb-12 space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className={`h-6 w-6 shrink-0 text-${color}-500`} />
                      <span className="font-medium text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-slate-100 border-t pt-8">
                  <button
                    type="button"
                    onClick={onCallToActionPress}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-medium text-lg text-white transition-colors hover:bg-slate-800"
                  >
                    {callToActionLabel ?? `Explore ${title}`} <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
