import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useId } from "react";

interface DppCollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

function ArrowsCaretDown({ className }: { className?: string }) {
  return (
    <div className={`relative size-[24px] shrink-0 ${className || ""}`} data-name="Arrows / caret-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M 6 9 L 12 15 L 18 9"
          stroke="rgba(0,4,29,0.58)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export function DppCollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
  className = ""
}: DppCollapsibleSectionProps) {
  const id = useId();
  const panelId = `${id}-panel`;
  const headingId = `${id}-heading`;

  return (
    <section
      className={`relative box-border flex w-full flex-col content-stretch items-start gap-[18px] overflow-clip px-[20px] py-[12px] ${className}`}
      aria-labelledby={headingId}
    >
      <button
        type="button"
        onClick={onToggle}
        className="relative h-[51px] w-full shrink-0 focus-visible:outline-2 focus-visible:outline-[#6C7254] focus-visible:outline-offset-2"
        data-name="section header"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <div className="relative flex h-[51px] w-full content-stretch items-center justify-between overflow-clip rounded-[inherit]">
          <h2
            id={headingId}
            className="relative m-0 flex min-h-px min-w-px shrink-0 grow basis-0 items-center overflow-hidden overflow-ellipsis text-nowrap text-left font-['SF_Pro:Medium',sans-serif] font-[510] font-width-normal text-[16px] text-[rgba(0,4,29,0.58)] leading-[24px] [white-space-collapse:collapse]"
          >
            {title}
          </h2>
          <div
            className={`relative flex shrink-0 items-center justify-center transition-transform duration-300 ${isOpen ? "" : "-rotate-90"}`}
            aria-hidden="true"
          >
            <ArrowsCaretDown />
          </div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headingId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden pb-[20px]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
