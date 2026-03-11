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
    <div className={`relative shrink-0 size-[24px] ${className || ""}`} data-name="Arrows / caret-down">
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
      className={`box-border content-stretch flex flex-col gap-[18px] items-start overflow-clip px-[20px] py-[12px] relative w-full ${className}`}
      aria-labelledby={headingId}
    >
      <button
        onClick={onToggle}
        className="h-[51px] relative shrink-0 w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C7254]"
        data-name="section header"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <div className="content-stretch flex h-[51px] items-center justify-between overflow-clip relative rounded-[inherit] w-full">
          <h2
            id={headingId}
            className="[white-space-collapse:collapse] basis-0 font-['SF_Pro:Medium',sans-serif] font-[510] grow leading-[24px] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-[rgba(0,4,29,0.58)] text-nowrap text-left m-0 flex items-center font-width-normal"
          >
            {title}
          </h2>
          <div
            className={`flex items-center justify-center relative shrink-0 transition-transform duration-300 ${isOpen ? "" : "-rotate-90"}`}
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
            className="overflow-hidden w-full pb-[20px]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
