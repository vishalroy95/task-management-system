import { TaskTable } from "@/components/tasks/task-table";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/project";
import type { TaskField, TaskSectionData, TaskStatus } from "@/types/task";

type TaskSectionProps = {
  fields: TaskField[];
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  onUpdateTask?: (
    taskId: string,
    task: Partial<TaskSectionData["tasks"][number]>,
  ) => Promise<void> | void;
  projects?: Project[];
  section: TaskSectionData;
};

const statusDotStyles: Record<TaskStatus, string> = {
  completed: "bg-emerald-500 dark:bg-emerald-400",
  doing: "bg-amber-500 dark:bg-amber-400",
  on_hold: "bg-sky-500 dark:bg-sky-400",
  todo: "bg-slate-400 dark:bg-slate-500",
};

export function TaskSection({
  fields,
  onDeleteTask,
  onUpdateTask,
  projects,
  section,
}: TaskSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
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
        <span className="rounded-full border border-border/60 bg-surface-muted px-2.5 py-0.5 text-caption font-semibold text-muted-foreground shadow-xs">
          {section.tasks.length}
        </span>
      </div>
      {section.tasks.length === 0 ? (
        <div className="px-4 py-8 text-center text-body text-muted-foreground">
          No tasks match the current controls.
        </div>
      ) : (
        <TaskTable
          fields={fields}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
          projects={projects ?? []}
          tasks={section.tasks}
        />
      )}
    </section>
  );
}
