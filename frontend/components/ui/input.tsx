import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isInvalid?: boolean;
};

export function Input({ className, isInvalid = false, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border bg-surface px-3 text-body text-foreground shadow-xs transition-colors",
        "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-70",
        isInvalid ? "border-danger" : "border-border focus:border-primary",
        className,
      )}
      aria-invalid={isInvalid || undefined}
      {...props}
    />
  );
}
