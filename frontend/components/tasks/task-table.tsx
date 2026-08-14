import { TaskRow } from "@/components/tasks/task-row";
import type { Project } from "@/types/project";
import type { Task, TaskField } from "@/types/task";

type TaskTableProps = {
  fields: TaskField[];
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  onUpdateTask?: (taskId: string, task: Partial<Task>) => Promise<void> | void;
  projects?: Project[];
  tasks: Task[];
};

const columnLabels: Record<TaskField, string> = {
  dueDate: "Due Date",
  labels: "Labels",
  members: "Members",
  priority: "Priority",
  reporter: "Reporter",
  status: "Status",
};

export function TaskTable({
  fields,
  onDeleteTask,
  onUpdateTask,
  projects,
  tasks,
}: TaskTableProps) {
  const columns = [
    "Task",
    ...fields.map((field) => columnLabels[field]),
    "Actions",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[48rem] border-collapse text-left text-body">
        <thead>
          <tr className="border-b border-border bg-surface-muted/60">
            {columns.map((column) => (
              <th
                className="px-4 py-2.5 text-left text-caption font-semibold uppercase tracking-wider text-muted-foreground"
                key={column}
                scope="col"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {tasks.map((task) => (
            <TaskRow
              fields={fields}
              key={task.id}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
              projects={projects}
              task={task}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
