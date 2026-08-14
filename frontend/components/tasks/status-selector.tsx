"use client";

import { Badge, Dropdown } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { TaskStatus } from "@/types/task";

type StatusSelectorProps = {
  onChange?: (nextStatus: TaskStatus) => void;
  selectedStatus?: TaskStatus;
  triggerClassName?: string;
};

const statusOptions: Array<{
  label: string;
  value: TaskStatus;
  variant: "default" | "warning" | "success";
}> = [
  { label: "To Do", value: "todo", variant: "default" },
  { label: "Doing", value: "doing", variant: "warning" },
  { label: "Completed", value: "completed", variant: "success" },
  { label: "On Hold", value: "on_hold", variant: "default" },
];

export function StatusSelector({
  onChange,
  selectedStatus = "todo",
  triggerClassName,
}: StatusSelectorProps) {
  const current = statusOptions.find((option) => option.value === selectedStatus) ?? statusOptions[0];

  return (
    <Dropdown
      align="left"
      label={
        <span
          className={cn(
            "inline-flex items-center rounded-md border border-transparent px-2 py-1 text-left",
            triggerClassName,
          )}
        >
          <Badge variant={current.variant}>{current.label}</Badge>
        </span>
      }
      panelClassName="w-52 p-2"
      triggerClassName="h-auto border-0 bg-transparent px-0 shadow-none hover:bg-transparent"
    >
      <div className="space-y-1" role="menu">
        {statusOptions.map((option) => {
          const isSelected = option.value === selectedStatus;

          return (
            <button
              aria-checked={isSelected}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-body text-foreground transition-colors hover:bg-surface-muted",
                isSelected && "bg-surface-muted",
              )}
              key={option.value}
              onClick={() => onChange?.(option.value)}
              role="menuitemradio"
              type="button"
            >
              <Badge variant={option.variant}>{option.label}</Badge>
              {isSelected ? (
                <svg
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </svg>
              ) : (
                <span className="size-4 shrink-0 rounded-sm border border-border" />
              )}
            </button>
          );
        })}
      </div>
    </Dropdown>
  );
}
