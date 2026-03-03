import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { classNames } from "../utilities/classNames";

interface WebsiteButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "icon";
  size?: "small" | "medium" | "large" | "icon";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

const variantClassNames: Record<NonNullable<WebsiteButtonProps["variant"]>, string> = {
  primary: "bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand/90 hover:scale-105 active:scale-95",
  secondary: "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
  outline: "border border-slate-200 text-slate-900 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  icon: "border border-slate-200 bg-white shadow-lg hover:shadow-xl"
};

const sizeClassNames: Record<NonNullable<WebsiteButtonProps["size"]>, string> = {
  small: "rounded-lg px-4 py-3 text-sm font-medium",
  medium: "rounded-full px-6 py-3 text-base font-medium",
  large: "rounded-full px-8 py-4 text-base font-semibold",
  icon: "rounded-full"
};

export function WebsiteButton({
  variant = "primary",
  size = "large",
  icon: Icon,
  iconPosition = "right",
  className,
  children,
  type = "button",
  ...rest
}: WebsiteButtonProps) {
  const iconElement = Icon ? (
    <Icon
      className={classNames("h-4 w-4 transition-transform", iconPosition === "right" && "group-hover:translate-x-0.5")}
    />
  ) : null;

  return (
    <button
      type={type}
      className={classNames(
        "group inline-flex items-center justify-center gap-2 transition-all",
        variantClassNames[variant],
        sizeClassNames[size],
        className
      )}
      {...rest}
    >
      {iconPosition === "left" && iconElement}
      {children}
      {iconPosition === "right" && iconElement}
    </button>
  );
}
