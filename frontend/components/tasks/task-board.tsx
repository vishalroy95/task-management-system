"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui";
import { MemberAvatar } from "@/components/tasks/member-avatar";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { StatusSelector } from "@/components/tasks/status-selector";
import { TaskActions } from "@/components/tasks/task-actions";
import {
  TaskDateCell,
  TaskPriorityCell,
} from "@/components/tasks/task-interactive-cells";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/project";
import type { TaskField, TaskSectionData, TaskStatus } from "@/types/task";

type TaskBoardProps = {
  fields: TaskField[];
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  onUpdateTask?: (
    taskId: string,
    task: Partial<TaskSectionData["tasks"][number]>,
  ) => Promise<void> | void;
  projects?: Project[];
  sections: TaskSectionData[];
};

const statusDotStyles: Record<TaskStatus, string> = {
  completed: "bg-emerald-500 dark:bg-emerald-400",
  doing: "bg-amber-500 dark:bg-amber-400",
  on_hold: "bg-sky-500 dark:bg-sky-400",
  todo: "bg-slate-400 dark:bg-slate-500",
};

export function TaskBoard({
  fields,
  onDeleteTask,
  onUpdateTask,
  projects,
  sections,
}: TaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<TaskStatus | null>(null);

  function handleDragStart(
    event: React.DragEvent<HTMLElement>,
    taskId: string,
  ) {
    event.dataTransfer.setData("text/plain", taskId);
    event.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(taskId);
  }

  function handleDragEnd() {
    setDraggedTaskId(null);
    setDragOverColumnId(null);
  }

  function handleDragOver(
    event: React.DragEvent<HTMLElement>,
    columnId: TaskStatus,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  }

  function handleDragLeave(
    event: React.DragEvent<HTMLElement>,
    columnId: TaskStatus,
  ) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    if (dragOverColumnId === columnId) {
      setDragOverColumnId(null);
    }
  }

  function handleDrop(
    event: React.DragEvent<HTMLElement>,
    targetStatus: TaskStatus,
  ) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain") || draggedTaskId;
    setDragOverColumnId(null);
    setDraggedTaskId(null);

    if (!taskId) {
      return;
    }

    const currentSection = sections.find((section) =>
      section.tasks.some((task) => task.id === taskId),
    );

    if (currentSection && currentSection.id !== targetStatus) {
      void onUpdateTask?.(taskId, { status: targetStatus });
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sections.map((section) => {
        const isColumnOver = dragOverColumnId === section.id;

        return (
          <section
            aria-label={`${section.title} column`}
            className={cn(
              "flex min-h-[460px] flex-col rounded-xl border border-border bg-surface-muted/40 p-3 transition-colors",
              isColumnOver && "border-primary/50 bg-primary/5 ring-2 ring-primary/20",
            )}
            key={section.id}
            onDragLeave={(event) => handleDragLeave(event, section.id)}
            onDragOver={(event) => handleDragOver(event, section.id)}
            onDrop={(event) => handleDrop(event, section.id)}
          >
            <div className="mb-3 flex items-center justify-between border-b border-border/70 pb-2.5">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 rounded-full",
                    statusDotStyles[section.id] ?? "bg-slate-400",
                  )}
                />
                <h2 className="text-body font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>
              <span className="rounded-full border border-border/60 bg-surface px-2 py-0.5 text-caption font-semibold text-muted-foreground shadow-xs">
                {section.tasks.length}
              </span>
            </div>

            <div className="flex-1 space-y-3">
              {section.tasks.length === 0 ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-surface/50 p-6 text-center text-caption text-muted-foreground transition-colors">
                  <p className="font-medium">No tasks in this column</p>
                  <p className="mt-1 text-xs text-muted-foreground/80">
                    Drag and drop tasks here to update status
                  </p>
                </div>
              ) : (
                section.tasks.map((task) => {
                  const isBeingDragged = draggedTaskId === task.id;

                  return (
                    <article
                      aria-grabbed={isBeingDragged}
                      className={cn(
                        "group relative cursor-grab rounded-lg border border-border bg-surface p-3.5 shadow-xs transition-all hover:border-border-strong hover:shadow-sm active:cursor-grabbing",
                        isBeingDragged && "scale-[0.98] border-primary/50 opacity-40 shadow-md",
                      )}
                      draggable
                      key={task.id}
                      onDragEnd={handleDragEnd}
                      onDragStart={(event) => handleDragStart(event, task.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          className="line-clamp-2 text-body font-medium text-foreground transition-colors hover:text-primary"
                          href={`/tasks/${task.id}`}
                        >
                          {task.title}
                        </Link>
                        <TaskActions
                          initialStatus={task.status}
                          onDelete={() => onDeleteTask?.(task.id)}
                          onEdit={(nextTask) => onUpdateTask?.(task.id, nextTask)}
                          onStatusChange={(status) =>
                            onUpdateTask?.(task.id, { status })
                          }
                          projects={projects ?? []}
                          task={task}
                          taskTitle={task.title}
                        />
                      </div>

                      {task.description ? (
                        <p className="mt-1 line-clamp-2 text-caption leading-relaxed text-muted-foreground">
                          {task.description}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {fields.includes("priority") ? (
                          <>
                            <div className="hidden sm:block">
                              <TaskPriorityCell
                                initialPriority={task.priority}
                                onPriorityChange={(priority) =>
                                  onUpdateTask?.(task.id, { priority })
                                }
                              />
                            </div>
                            <div className="sm:hidden">
                              <PriorityBadge priority={task.priority} />
                            </div>
                          </>
                        ) : null}

                        {fields.includes("status") ? (
                          <StatusSelector
                            onChange={(status) => onUpdateTask?.(task.id, { status })}
                            selectedStatus={task.status}
                            triggerClassName="h-7 px-1.5 py-0.5 text-caption"
                          />
                        ) : null}

                        {fields.includes("dueDate") ? (
                          <TaskDateCell
                            initialDate={task.dueDate}
                            onDateChange={(date) =>
                              onUpdateTask?.(task.id, {
                                dueDate: date.toISOString().slice(0, 10),
                              })
                            }
                          />
                        ) : null}
                      </div>

                      {fields.includes("labels") && task.labels.length > 0 ? (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {task.labels.map((label) => (
                            <Badge key={label}>{label}</Badge>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-border/50 pt-2.5">
                        {fields.includes("members") ? (
                          <div className="flex items-center">
                            {task.members.map((member, index) => (
                              <MemberAvatar
                                className={index > 0 ? "-ml-2" : undefined}
                                key={member.id}
                                member={member}
                              />
                            ))}
                          </div>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-2">
                          {fields.includes("reporter") ? (
                            <span className="max-w-28 truncate text-caption text-muted-foreground">
                              {task.reporter.name}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
