import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useCallback, useRef } from "react";

interface WebsiteCardProps {
  children: ReactNode;
  expandableIdentifier?: string;
  onPress?: () => void;
  showArrow?: boolean;
  arrowPosition?: "top" | "bottom";
  badge?: string;
  badgeClassName?: string;
  entranceDelay?: number;
  footer?: ReactNode;
  className?: string;
  illustration?: ReactNode;
  illustrationColor?: string;
  fillVisual?: boolean;
  fadeVisualOnResize?: boolean;
}

interface WebsiteCardIconProps {
  icon: LucideIcon;
  iconClassName?: string;
  iconWrapperClassName?: string;
  hoverTransition?: boolean;
}

const baseClassName =
  "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg sm:p-6 hover-gradient-border";

const illustrationGradientClassNames: Record<string, string> = {
  slate: "bg-radial-dark-sun-corner",
  emerald: "bg-radial-accent-sun-corner",
  indigo: "bg-radial-green-sun-corner",
  cyan: "bg-radial-dark-sun-corner",
  rose: "bg-radial-accent-sun-corner",
  blue: "bg-radial-green-sun-corner"
};

function useGradientAngle() {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--mouse-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const onMouseLeave = useCallback(() => {
    ref.current?.style.removeProperty("--mouse-x");
    ref.current?.style.removeProperty("--mouse-y");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

const dispatchResize = () => window.dispatchEvent(new Event("resize"));

export function WebsiteCard({
  children,
  expandableIdentifier,
  onPress,
  showArrow = false,
  arrowPosition = "top",
  badge,
  badgeClassName,
  entranceDelay,
  footer,
  className,
  illustration,
  illustrationColor,
  fillVisual = false,
  fadeVisualOnResize = false
}: WebsiteCardProps) {
  const { ref, onMouseMove, onMouseLeave } = useGradientAngle();
  const visualRef = useRef<HTMLDivElement>(null);
  const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName;

  const arrowIndicator = showArrow ? (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
      <ArrowUpRight className="h-4 w-4 text-slate-600" />
    </div>
  ) : null;

  const topArrowElement =
    showArrow && arrowPosition === "top" ? <div className="absolute top-5 right-5">{arrowIndicator}</div> : null;

  const defaultBadgeClassName = "border-brand-accent/20 bg-brand-accent/10 text-brand-accent";
  const badgeElement = badge ? (
    <div className="mb-3">
      <span
        className={`inline-flex rounded-full border px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider ${badgeClassName ?? defaultBadgeClassName}`}
      >
        {badge}
      </span>
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

  const illustrationPadding = fillVisual ? "" : "p-6 md:p-8";
  const illustrationInner = illustration ? (
    <div
      className={`relative flex h-[180px] items-center justify-center overflow-hidden md:h-[220px] ${illustrationPadding} ${illustrationGradient}`}
    >
      {fillVisual ? (
        <div ref={fadeVisualOnResize && expandableIdentifier ? visualRef : undefined} className="h-full w-full">
          {illustration}
        </div>
      ) : (
        <div className="w-full max-w-sm">{illustration}</div>
      )}
    </div>
  ) : null;

  const illustrationSection = illustration ? (
    <div className="-mx-5 mt-auto -mb-5 pt-6 sm:-mx-6 sm:-mb-6">{illustrationInner}</div>
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
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        layoutId={`card-${expandableIdentifier}`}
        onLayoutAnimationStart={() => {
          if (fadeVisualOnResize && visualRef.current) {
            visualRef.current.style.transition = "none";
            visualRef.current.style.opacity = "0";
          }
        }}
        onLayoutAnimationComplete={() => {
          dispatchResize();
          requestAnimationFrame(() => {
            if (fadeVisualOnResize && visualRef.current) {
              visualRef.current.style.transition = "opacity 0.5s ease";
              visualRef.current.style.opacity = "1";
            }
          });
        }}
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
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
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

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: mouse handlers are purely decorative (gradient tracking)
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={combinedClassName}>
      {content}
    </div>
  );
}

export function WebsiteCardIcon({
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
  hoverTransition = true
}: WebsiteCardIconProps) {
  if (hoverTransition) {
    return (
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors group-hover:border-brand/30 group-hover:bg-brand-surface">
        <Icon className="h-5 w-5 text-slate-600 transition-colors group-hover:text-brand" />
      </div>
    );
  }

  return (
    <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${iconWrapperClassName ?? ""}`}>
      <Icon className={`h-5 w-5 ${iconClassName ?? ""}`} />
    </div>
  );
}
