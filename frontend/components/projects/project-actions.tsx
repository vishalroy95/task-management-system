"use client";

import { useState } from "react";

import { Dropdown, MenuItem, MenuSection } from "@/components/ui";

function MoreIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

type ProjectActionsProps = {
  onDelete?: () => Promise<void> | void;
  projectName: string;
};

export function ProjectActions({ onDelete, projectName }: ProjectActionsProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <Dropdown
        label={<MoreIcon />}
        panelClassName="w-48"
        triggerClassName="size-8 px-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
      >
        <MenuSection title="Actions">
          <MenuItem label="Edit" onClick={() => setLastAction("Edit prepared")} />
          <MenuItem label="Archive" onClick={() => setLastAction("Archive prepared")} />
          <MenuItem
            destructive
            label="Delete"
            onClick={() => {
              setLastAction("Deleting");
              void onDelete?.();
            }}
          />
        </MenuSection>
      </Dropdown>
      {lastAction ? (
        <span className="max-w-28 truncate text-caption text-muted-foreground">
          {lastAction}
        </span>
      ) : (
        <span className="sr-only">Actions for {projectName}</span>
      )}
    </div>
  );
}
