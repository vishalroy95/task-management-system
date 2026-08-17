"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useFloatingPosition } from "@/hooks/use-floating-position";
import { cn } from "@/lib/cn";

const emptySubscribe = () => () => {};

type DropdownProps = {
  align?: "left" | "right";
  children: ReactNode;
  isOpen?: boolean;
  label: ReactNode;
  onOpenChange?: (nextOpen: boolean) => void;
  panelClassName?: string;
  triggerClassName?: string;
};

export function Dropdown({
  align = "right",
  children,
  isOpen: controlledIsOpen,
  label,
  onOpenChange,
  panelClassName,
  triggerClassName,
}: DropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen ?? internalIsOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (controlledIsOpen !== undefined) {
        onOpenChange?.(nextOpen);
        return;
      }

      setInternalIsOpen(nextOpen);
    },
    [controlledIsOpen, onOpenChange],
  );

  const { style: floatingStyle } = useFloatingPosition({
    align,
    gap: 6,
    isOpen,
    panelRef,
    triggerRef,
    zIndex: 50,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setOpen]);

  return (
    <div className={cn("relative inline-flex max-w-full", triggerClassName?.includes("w-full") && "w-full")}>
      <button
        aria-expanded={isOpen}
        className={cn(
          "inline-flex h-8 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-caption font-medium text-foreground shadow-xs transition-colors hover:bg-surface-muted",
          triggerClassName,
        )}
        onClick={() => setOpen(!isOpen)}
        ref={triggerRef}
        type="button"
      >
        {label}
      </button>
      {isOpen && mounted
        ? <div
            className={cn(
              "absolute w-72 max-h-48 overflow-y-auto rounded-lg border border-border bg-surface p-2 shadow-soft scrollbar-thin",
              panelClassName,
            )}
            ref={panelRef}
            style={floatingStyle}
          >
            {children}
          </div>
        : null}
    </div>
  );
}

type MenuItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  destructive?: boolean;
  icon?: ReactNode;
  label: string;
};

export function MenuItem({
  className,
  destructive = false,
  icon,
  label,
  ...props
}: MenuItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-body transition-colors hover:bg-surface-muted",
        destructive ? "text-danger" : "text-foreground",
        className,
      )}
      role="menuitem"
      type="button"
      {...props}
    >
      {icon ? <span className="shrink-0 text-muted-foreground">{icon}</span> : null}
      <span className="truncate">{label}</span>
    </button>
  );
}

type CheckboxMenuItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  checked: boolean;
  label: string;
};

export function CheckboxMenuItem({
  checked,
  className,
  label,
  ...props
}: CheckboxMenuItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-body text-foreground transition-colors hover:bg-surface-muted",
        className,
      )}
      role="menuitemcheckbox"
      type="button"
      {...props}
      aria-checked={checked}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-sm border border-border",
          checked && "border-primary bg-primary text-primary-foreground",
        )}
      >
        {checked ? (
          <svg aria-hidden="true" className="size-3" fill="none" viewBox="0 0 24 24">
            <path
              d="m5 12 4 4L19 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </svg>
        ) : null}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

type MenuSectionProps = {
  children: ReactNode;
  title: string;
};

export function MenuSection({ children, title }: MenuSectionProps) {
  return (
    <div className="py-1">
      <p className="px-2 py-1 text-caption font-semibold uppercase text-muted-foreground">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
