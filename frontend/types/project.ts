import type { Task, TaskMember, TaskPriority, TaskSectionData } from "@/types/task";

export type Project = {
  description: string;
  dueDate: string;
  id: string;
  lead: TaskMember;
  name: string;
  priority: TaskPriority;
  status: "planning" | "active" | "completed";
  tasks: TaskSectionData[];
};

export type ProjectField = "priority" | "lead" | "dueDate" | "status";

export type ProjectDetail = Project & {
  tasks: TaskSectionData[];
};

export type ProjectTask = Task;
