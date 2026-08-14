"use client";

import { useState } from "react";

import { EditTaskDialog } from "@/components/tasks/edit-task-dialog";
import { Dropdown, MenuItem, MenuSection } from "@/components/ui";
import type { Project } from "@/types/project";
import type { Task, TaskStatus } from "@/types/task";

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

type TaskActionsProps = {
  initialStatus?: TaskStatus;
  onDelete?: () => Promise<void> | void;
  onEdit?: (task: Partial<Task>) => Promise<void> | void;
  onStatusChange?: (status: TaskStatus) => Promise<void> | void;
  projects?: Project[];
  task: Task;
  taskTitle: string;
};

const statusLabels: Record<TaskStatus, string> = {
  completed: "Completed",
  doing: "Doing",
  on_hold: "On Hold",
  todo: "To Do",
};

export function TaskActions({
  initialStatus = "todo",
  onDelete,
  onEdit,
  onStatusChange,
  projects,
  task,
  taskTitle,
}: TaskActionsProps) {
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="inline-flex flex-col items-end gap-1">
        <Dropdown
          label={<MoreIcon />}
          panelClassName="w-52"
          triggerClassName="size-8 px-0"
        >
          <MenuSection title="Actions">
            <MenuItem
              label="Edit"
              onClick={() => {
                setLastAction("Editing");
                setIsEditOpen(true);
              }}
            />
            <MenuItem
              destructive
              label="Delete"
              onClick={() => {
                setLastAction("Deleting");
                void onDelete?.();
              }}
            />
          </MenuSection>
          <MenuSection title="Change Status">
            {(Object.keys(statusLabels) as TaskStatus[]).map((nextStatus) => (
              <MenuItem
                key={nextStatus}
                label={`${status === nextStatus ? "✓ " : ""}${statusLabels[nextStatus]}`}
                onClick={() => {
                  setStatus(nextStatus);
                  setLastAction(`Status: ${statusLabels[nextStatus]}`);
                  void onStatusChange?.(nextStatus);
                }}
              />
            ))}
          </MenuSection>
        </Dropdown>
        {lastAction ? (
          <span className="max-w-28 truncate text-caption text-muted-foreground">
            {lastAction}
          </span>
        ) : (
          <span className="sr-only">Actions for {taskTitle}</span>
        )}
      </div>

      {isEditOpen ? (
        <EditTaskDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={async (nextTask) => {
            setLastAction("Saved changes");
            await onEdit?.(nextTask);
          }}
          projects={projects ?? []}
          task={task}
        />
      ) : null}
    </>
  );
}
