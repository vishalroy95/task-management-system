import Link from "next/link";
import { useState } from "react";

import { AssigneeSelector } from "@/components/tasks/assignee-selector";
import { LabelsSelector } from "@/components/tasks/labels-selector";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { StatusSelector } from "@/components/tasks/status-selector";
import {
  TaskDateCell,
  TaskPriorityCell,
} from "@/components/tasks/task-interactive-cells";
import { TaskActions } from "@/components/tasks/task-actions";
import type { Project } from "@/types/project";
import type { Task, TaskField } from "@/types/task";

type TaskRowProps = {
  fields: TaskField[];
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  onUpdateTask?: (taskId: string, task: Partial<Task>) => Promise<void> | void;
  projects?: Project[];
  task: Task;
};

export function TaskRow({
  fields,
  onDeleteTask,
  onUpdateTask,
  projects,
  task,
}: TaskRowProps) {
  const [localMembers, setLocalMembers] = useState(task.members);
  const [localLabels, setLocalLabels] = useState(task.labels);
  const [localStatus, setLocalStatus] = useState(task.status);

  const currentTask = {
    ...task,
    labels: localLabels,
    members: localMembers,
    status: localStatus,
  };

  return (
    <tr className="border-b border-border transition-colors hover:bg-surface-muted/50 last:border-b-0">
      <td className="min-w-64 px-4 py-3 align-middle">
        <Link
          className="line-clamp-1 text-body font-medium text-foreground transition-colors hover:text-primary"
          href={`/tasks/${task.id}`}
        >
          {task.title}
        </Link>
      </td>
      {fields.includes("priority") ? (
        <td className="px-4 py-3 align-middle">
          <div className="hidden lg:block">
            <TaskPriorityCell
              initialPriority={task.priority}
              onPriorityChange={(priority) =>
                onUpdateTask?.(task.id, { priority })
              }
            />
          </div>
          <div className="lg:hidden">
            <PriorityBadge priority={task.priority} />
          </div>
        </td>
      ) : null}
      {fields.includes("members") ? (
        <td className="px-4 py-3 align-middle">
          <div className="flex items-center gap-2">
            <AssigneeSelector
              members={task.members}
              onSelect={(nextMember) => {
                const nextMembers = nextMember ? [nextMember] : [];
                setLocalMembers(nextMembers);
                void onUpdateTask?.(task.id, { members: nextMembers });
              }}
              selectedMember={localMembers[0] ?? null}
            />
          </div>
        </td>
      ) : null}
      {fields.includes("dueDate") ? (
        <td className="whitespace-nowrap px-4 py-3 align-middle text-body text-muted-foreground">
          <TaskDateCell
            initialDate={task.dueDate}
            onDateChange={(date) =>
              onUpdateTask?.(task.id, {
                dueDate: date.toISOString().slice(0, 10),
              })
            }
          />
        </td>
      ) : null}
      {fields.includes("labels") ? (
        <td className="px-4 py-3 align-middle">
          <LabelsSelector
            availableLabels={task.labels}
            onChange={(nextLabels) => {
              setLocalLabels(nextLabels);
              void onUpdateTask?.(task.id, { labels: nextLabels });
            }}
            selectedLabels={localLabels}
          />
        </td>
      ) : null}
      {fields.includes("status") ? (
        <td className="whitespace-nowrap px-4 py-3 align-middle text-body text-muted-foreground">
          <StatusSelector
            onChange={(nextStatus) => {
              setLocalStatus(nextStatus);
              void onUpdateTask?.(task.id, { status: nextStatus });
            }}
            selectedStatus={localStatus}
          />
        </td>
      ) : null}
      {fields.includes("reporter") ? (
        <td className="whitespace-nowrap px-4 py-3 align-middle text-body text-muted-foreground">
          <span className="truncate">{task.reporter.name}</span>
        </td>
      ) : null}
      <td className="px-4 py-3 text-right align-middle">
        <TaskActions
          initialStatus={task.status}
          onDelete={() => onDeleteTask?.(task.id)}
          onEdit={(nextTask) => onUpdateTask?.(task.id, nextTask)}
          onStatusChange={(status) => onUpdateTask?.(task.id, { status })}
          projects={projects}
          task={currentTask}
          taskTitle={task.title}
        />
      </td>
    </tr>
  );
}
