import type { Task, TaskDueDateRange, TaskPriority, TaskStatus } from "@/types/task";

export type FilterOption<T extends string = string> = {
  label: string;
  value: T;
};

export const statusOptions: FilterOption<TaskStatus>[] = [
  { label: "To Do", value: "todo" },
  { label: "Doing", value: "doing" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on_hold" },
];

export const priorityOptions: FilterOption<TaskPriority>[] = [
  { label: "No Priority", value: "none" },
  { label: "Urgent", value: "urgent" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const dueDateOptions: FilterOption<TaskDueDateRange>[] = [
  { label: "This week", value: "this-week" },
  { label: "Next week", value: "next-week" },
  { label: "Later", value: "later" },
];

export function createUniqueOptions(
  tasks: Task[],
  getValues: (task: Task) => string[],
) {
  return Array.from(new Set(tasks.flatMap(getValues)))
    .sort((first, second) => first.localeCompare(second))
    .map((value) => ({ label: value, value }));
}

export function createMemberOptions(tasks: Task[]) {
  const members = new Map<string, string>();

  tasks.forEach((task) => {
    task.members.forEach((member) => {
      members.set(member.id, member.name);
    });
  });

  return Array.from(members.entries())
    .sort((first, second) => first[1].localeCompare(second[1]))
    .map(([value, label]) => ({ label, value }));
}

export function createReporterOptions(tasks: Task[]) {
  const reporters = new Map<string, string>();

  tasks.forEach((task) => {
    reporters.set(task.reporter.id, task.reporter.name);
  });

  return Array.from(reporters.entries())
    .sort((first, second) => first[1].localeCompare(second[1]))
    .map(([value, label]) => ({ label, value }));
}
