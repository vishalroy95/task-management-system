import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "priorityLow"
  | "priorityMedium"
  | "priorityHigh"
  | "priorityUrgent";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  priorityLow: "bg-priority-low text-success-foreground",
  priorityMedium: "bg-priority-medium text-warning-foreground",
  priorityHigh: "bg-priority-high text-warning-foreground",
  priorityUrgent: "bg-priority-urgent text-danger-foreground",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-sm px-2 py-0.5 text-caption font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
