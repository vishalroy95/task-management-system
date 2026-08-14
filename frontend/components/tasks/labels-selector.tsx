"use client";

import { Badge, CheckboxMenuItem, Dropdown } from "@/components/ui";
import { cn } from "@/lib/cn";

type LabelsSelectorProps = {
  availableLabels?: string[];
  onChange?: (nextLabels: string[]) => void;
  selectedLabels?: string[];
  triggerClassName?: string;
};

export function LabelsSelector({
  availableLabels = [],
  onChange,
  selectedLabels = [],
  triggerClassName,
}: LabelsSelectorProps) {
  const allLabels = Array.from(
    new Set<string>([...availableLabels, ...selectedLabels].map((label) => String(label).trim()).filter(Boolean)),
  ).sort((first, second) => first.localeCompare(second));

  return (
    <Dropdown
      align="left"
      label={
        <span
          className={cn(
            "inline-flex min-h-9 flex-wrap items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-left",
            triggerClassName,
          )}
        >
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label) => (
              <Badge key={label}>{label}</Badge>
            ))
          ) : (
            <span className="text-caption text-muted-foreground">No labels</span>
          )}
        </span>
      }
      panelClassName="w-64 p-2"
      triggerClassName="h-auto border-0 bg-transparent px-0 shadow-none hover:bg-transparent"
    >
      <div className="space-y-1" role="menu">
        {allLabels.length > 0 ? (
          allLabels.map((label) => {
            const isSelected = selectedLabels.includes(label);

            return (
              <CheckboxMenuItem
                checked={isSelected}
                key={label}
                label={label}
                onClick={() => {
                  const nextLabels = isSelected
                    ? selectedLabels.filter((currentLabel) => currentLabel !== label)
                    : [...selectedLabels, label].sort((first, second) => first.localeCompare(second));

                  onChange?.(nextLabels);
                }}
              />
            );
          })
        ) : (
          <p className="px-2 py-2 text-body text-muted-foreground">No labels available</p>
        )}

        {selectedLabels.length > 0 ? (
          <button
            className="mt-2 w-full rounded-md px-2 py-2 text-left text-body text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            onClick={() => onChange?.([])}
            type="button"
          >
            Clear all
          </button>
        ) : null}
      </div>
    </Dropdown>
  );
}
