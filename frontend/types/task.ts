export type TaskPriority = "none" | "low" | "medium" | "high" | "urgent";

export type TaskStatus = "todo" | "doing" | "completed" | "on_hold";

export type TaskDueDateRange = "this-week" | "next-week" | "later";

export type TaskMember = {
  id: string;
  name: string;
  initials: string;
};

export type Task = {
  description: string;
  dueDateRange: TaskDueDateRange;
  id: string;
  labels: string[];
  title: string;
  priority: TaskPriority;
  projectId?: string;
  members: TaskMember[];
  reporter: TaskMember;
  team: string;
  dueDate: string;
  status: TaskStatus;
};

export type TaskSectionData = {
  id: TaskStatus;
  title: string;
  tasks: Task[];
};

export type TaskViewMode = "list" | "board";

export type TaskField = "priority" | "members" | "dueDate" | "labels" | "status" | "reporter";

export type TaskResource = {
  id: string;
  name: string;
  type: string;
  url: string;
};

export type TaskComment = {
  author: TaskMember;
  id: string;
  message: string;
  timestamp: string;
};

export type TaskUpdate = {
  id: string;
  message: string;
  timestamp: string;
};

export type TaskDetail = Task & {
  comments: TaskComment[];
  resources: TaskResource[];
  subtasks: Task[];
  updates: TaskUpdate[];
};
