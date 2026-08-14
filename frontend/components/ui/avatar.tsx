import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  alt: string;
  fallback: string;
  size?: AvatarSize;
  src?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-8 text-caption",
  md: "size-10 text-body",
  lg: "size-12 text-title",
};

export function Avatar({
  alt,
  className,
  fallback,
  size = "md",
  src,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted font-semibold text-muted-foreground",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} className="size-full object-cover" src={src} />
      ) : (
        <span aria-label={alt}>{fallback.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
