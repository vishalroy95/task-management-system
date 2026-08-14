import { Button } from "@/components/ui";
import { TaskTable } from "@/components/tasks/task-table";
import type { Task } from "@/types/task";

type SubtaskTableProps = {
  subtasks: Task[];
};

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SubtaskTable({ subtasks }: SubtaskTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-body font-semibold text-foreground">Subtasks</h2>
        <Button size="sm" variant="secondary">
          <PlusIcon />
          Add Subtasks
        </Button>
      </div>
      <TaskTable fields={["priority", "members", "dueDate"]} projects={[]} tasks={subtasks} />
    </section>
  );
}
