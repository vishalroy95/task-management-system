import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type IconButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type IconButtonSize = "sm" | "md" | "lg";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const variantClasses: Record<IconButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-muted",
  ghost: "text-foreground hover:bg-surface-muted",
  danger: "bg-danger text-danger-foreground hover:brightness-95",
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-11",
};

export function IconButton({
  className,
  variant = "ghost",
  size = "md",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md shadow-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
