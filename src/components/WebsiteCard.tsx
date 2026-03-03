import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface WebsiteCardProps {
  children: ReactNode;
  expandableIdentifier?: string;
  onPress?: () => void;
  showArrow?: boolean;
  arrowPosition?: "top" | "bottom";
  badge?: string;
  entranceDelay?: number;
  footer?: ReactNode;
  className?: string;
  illustration?: ReactNode;
  illustrationColor?: string;
}

interface WebsiteCardIconProps {
  icon: LucideIcon;
  iconClassName?: string;
  iconWrapperClassName?: string;
  hoverTransition?: boolean;
}

const baseClassName =
  "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg sm:p-6";

const defaultHoverClassName = "hover:border-slate-300";
const expandableHoverClassName = "hover:border-brand";

const illustrationGradientClassNames: Record<string, string> = {
  slate: "bg-gradient-to-br from-slate-50 to-slate-100/50",
  emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
  indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100/50",
  cyan: "bg-gradient-to-br from-cyan-50 to-cyan-100/50",
  rose: "bg-gradient-to-br from-rose-50 to-rose-100/50",
  blue: "bg-gradient-to-br from-blue-50 to-blue-100/50"
};

export function WebsiteCard({
  children,
  expandableIdentifier,
  onPress,
  showArrow = false,
  arrowPosition = "top",
  badge,
  entranceDelay,
  footer,
  className,
  illustration,
  illustrationColor
}: WebsiteCardProps) {
  const hoverClassName = expandableIdentifier ? expandableHoverClassName : defaultHoverClassName;
  const combinedClassName = className
    ? `${baseClassName} ${hoverClassName} ${className}`
    : `${baseClassName} ${hoverClassName}`;

  const arrowIndicator = showArrow ? (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
      <ArrowUpRight className="h-4 w-4 text-slate-600" />
    </div>
  ) : null;

  const topArrowElement =
    showArrow && arrowPosition === "top" ? <div className="absolute top-5 right-5">{arrowIndicator}</div> : null;

  const badgeElement = badge ? (
    <div className="absolute top-4 right-4 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider">
      {badge}
    </div>
  ) : null;

  const bottomArrowElement = showArrow && arrowPosition === "bottom" ? arrowIndicator : null;

  const footerElement = footer ? (
    <div className="flex items-center justify-between border-slate-100 border-t pt-4">
      <div className="flex-1">{footer}</div>
      {bottomArrowElement}
    </div>
  ) : null;

  const illustrationGradient =
    (illustrationColor && illustrationGradientClassNames[illustrationColor]) ?? "bg-brand-surface";

  const illustrationInner = illustration ? (
    <div
      className={`flex min-h-[150px] items-center justify-center p-6 md:min-h-[200px] md:p-8 ${illustrationGradient}`}
    >
      {illustration}
    </div>
  ) : null;

  const illustrationSection = illustration ? (
    <div className="-mx-5 mt-auto -mb-5 pt-6 sm:-mx-6 sm:-mb-6">
      {expandableIdentifier ? (
        <motion.div layoutId={`visual-${expandableIdentifier}`}>{illustrationInner}</motion.div>
      ) : (
        illustrationInner
      )}
    </div>
  ) : null;

  const content = (
    <>
      {badgeElement}
      {topArrowElement}
      {children}
      {illustrationSection}
      {footerElement}
    </>
  );

  if (expandableIdentifier) {
    return (
      <motion.div
        layoutId={`card-${expandableIdentifier}`}
        onClick={onPress}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onPress?.();
          }
        }}
        className={`${combinedClassName} cursor-pointer`}
      >
        {content}
      </motion.div>
    );
  }

  if (entranceDelay !== undefined) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: entranceDelay }}
        className={combinedClassName}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={combinedClassName}>{content}</div>;
}

export function WebsiteCardIcon({
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
  hoverTransition = true
}: WebsiteCardIconProps) {
  if (hoverTransition) {
    return (
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50">
        <Icon className="h-5 w-5 text-slate-600 transition-colors group-hover:text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${iconWrapperClassName ?? ""}`}>
      <Icon className={`h-5 w-5 ${iconClassName ?? ""}`} />
    </div>
  );
}
