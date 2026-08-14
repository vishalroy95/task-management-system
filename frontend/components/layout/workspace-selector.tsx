"use client";

import { useMemo, useState } from "react";

import { Avatar, Dropdown } from "@/components/ui";
import { cn } from "@/lib/cn";

type WorkspaceSelectorOption = {
  id: string;
  name: string;
  description: string;
  fallback: string;
};

const selectorOptions: WorkspaceSelectorOption[] = [
  {
    id: "ag-workspace",
    name: "Ag Workspace",
    description: "Primary workspace",
    fallback: "AG",
  },
  {
    id: "design-team",
    name: "Design Team",
    description: "Creative operations",
    fallback: "DT",
  },
  {
    id: "marketing-team",
    name: "Marketing Team",
    description: "Campaign planning",
    fallback: "MT",
  },
];

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function WorkspaceSelector({
  workspace,
}: {
  workspace: {
    name: string;
    fallback: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(
    selectorOptions.some((option) => option.name === workspace.name)
      ? selectorOptions.find((option) => option.name === workspace.name)?.id ?? "ag-workspace"
      : "ag-workspace",
  );

  const selectedOption = useMemo(
    () =>
      selectorOptions.find((option) => option.id === selectedId) ?? selectorOptions[0],
    [selectedId],
  );

  return (
    <Dropdown
      align="left"
      isOpen={isOpen}
      label={
        <div className="flex w-full items-center gap-3 text-left">
          <Avatar
            alt={`${selectedOption.name} workspace`}
            className="bg-primary text-primary-foreground"
            fallback={selectedOption.fallback}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-body font-semibold text-foreground">
              {selectedOption.name}
            </div>
            <div className="truncate text-caption text-muted-foreground">
              {selectedOption.description}
            </div>
          </div>
          <ChevronDownIcon />
        </div>
      }
      onOpenChange={setIsOpen}
      panelClassName="w-72 p-2"
      triggerClassName="h-auto w-full justify-start rounded-lg border border-border bg-transparent px-2 py-2 shadow-none hover:bg-surface-muted"
    >
      <div className="space-y-1">
        {selectorOptions.map((option) => {
          const isSelected = option.id === selectedId;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
                isSelected
                  ? "bg-surface-muted text-foreground"
                  : "text-foreground hover:bg-surface-muted",
              )}
              key={option.id}
              onClick={() => {
                setSelectedId(option.id);
                setIsOpen(false);
              }}
              type="button"
            >
              <Avatar
                alt={`${option.name} workspace`}
                className={cn(
                  isSelected ? "bg-primary text-primary-foreground" : "bg-surface-muted",
                )}
                fallback={option.fallback}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-body font-medium text-foreground">
                  {option.name}
                </div>
                <div className="truncate text-caption text-muted-foreground">
                  {option.description}
                </div>
              </div>
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
              ) : null}
            </button>
          );
        })}
      </div>
    </Dropdown>
  );
}
