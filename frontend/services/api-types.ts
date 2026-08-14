import type { Project } from "@/types/project";
import type {
  Task,
  TaskComment,
  TaskDetail,
  TaskDueDateRange,
  TaskMember,
  TaskPriority,
  TaskResource,
  TaskStatus,
  TaskUpdate,
} from "@/types/task";

export type ApiUser = {
  email?: string;
  fullName?: string;
  id: string;
  title?: string;
  username?: string;
};

export type ApiLabel = {
  color?: string;
  id: string;
  name: string;
};

export type ApiTask = {
  comments?: ApiComment[];
  createdAt?: string;
  description?: string;
  dueDate?: string;
  id: string;
  labels?: ApiLabel[];
  members?: ApiUser[];
  priority: TaskPriority;
  project?: ApiProject;
  projectId?: string;
  reporter?: ApiUser;
  resources?: ApiResource[];
  status: TaskStatus;
  subtasks?: ApiSubtask[];
  title: string;
  updates?: ApiTaskUpdate[];
};

export type ApiProject = {
  description?: string;
  dueDate?: string;
  id: string;
  lead?: ApiUser;
  name: string;
  priority: TaskPriority;
  status: "planning" | "active" | "completed";
  tasks?: ApiTask[];
};

export type ApiSubtask = {
  dueDate?: string;
  id: string;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
};

export type ApiComment = {
  author?: ApiUser;
  body: string;
  createdAt?: string;
  id: string;
};

export type ApiResource = {
  id: string;
  name: string;
  type: string;
  url: string;
};

export type ApiTaskUpdate = {
  author?: ApiUser;
  createdAt?: string;
  id: string;
  message: string;
};

function toMember(user?: ApiUser): TaskMember {
  const name = user?.fullName ?? "Unassigned";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: user?.id ?? "unassigned",
    initials: initials || "UA",
    name,
  };
}

function formatDate(value?: string) {
  if (!value) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function calculateDueDateRange(value?: string): TaskDueDateRange {
  if (!value) {
    return "later";
  }

  const dueDate = new Date(value);
  if (Number.isNaN(dueDate.getTime())) {
    return "later";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  const dayOfWeek = today.getDay();
  const daysUntilEndOfWeek = (7 - dayOfWeek) % 7 || 7;
  const endOfThisWeek = new Date(today.getTime() + daysUntilEndOfWeek * 24 * 60 * 60 * 1000);
  const endOfNextWeek = new Date(endOfThisWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (target <= endOfThisWeek) {
    return "this-week";
  }
  if (target <= endOfNextWeek) {
    return "next-week";
  }
  return "later";
}

export function mapApiTask(task: ApiTask): Task {
  return {
    description: task.description ?? "",
    dueDate: formatDate(task.dueDate),
    dueDateRange: calculateDueDateRange(task.dueDate),
    id: task.id,
    labels: task.labels?.map((label) => label.name) ?? [],
    members: task.members?.map(toMember) ?? [],
    priority: task.priority,
    projectId: task.projectId ?? task.project?.id,
    reporter: toMember(task.reporter),
    status: task.status,
    team: task.project?.name ?? "No project",
    title: task.title,
  };
}

export function mapApiTaskDetail(task: ApiTask): TaskDetail {
  return {
    ...mapApiTask(task),
    comments: task.comments?.map(mapApiComment) ?? [],
    resources: task.resources?.map(mapApiResource) ?? [],
    subtasks: task.subtasks?.map((subtask) => ({
      ...mapApiTask({
        ...subtask,
        description: "",
        labels: [],
        members: [],
        reporter: undefined,
      }),
      id: subtask.id,
    })) ?? [],
    updates: task.updates?.map(mapApiUpdate) ?? [],
  };
}

export function mapApiProject(project: ApiProject): Project {
  return {
    description: project.description ?? "",
    dueDate: formatDate(project.dueDate),
    id: project.id,
    lead: toMember(project.lead),
    name: project.name,
    priority: project.priority,
    status: project.status,
    tasks: groupTasksByStatus(project.tasks?.map(mapApiTask) ?? []),
  };
}

export function groupTasksByStatus(tasks: Task[]) {
  return [
    { id: "todo" as const, title: "To Do", tasks: tasks.filter((task) => task.status === "todo") },
    { id: "doing" as const, title: "Doing", tasks: tasks.filter((task) => task.status === "doing") },
    {
      id: "completed" as const,
      title: "Completed",
      tasks: tasks.filter((task) => task.status === "completed"),
    },
    {
      id: "on_hold" as const,
      title: "On Hold",
      tasks: tasks.filter((task) => task.status === "on_hold"),
    },
  ];
}

function mapApiComment(comment: ApiComment): TaskComment {
  return {
    author: toMember(comment.author),
    id: comment.id,
    message: comment.body,
    timestamp: comment.createdAt ? formatDate(comment.createdAt) : "Recently",
  };
}

function mapApiResource(resource: ApiResource): TaskResource {
  return resource;
}

function mapApiUpdate(update: ApiTaskUpdate): TaskUpdate {
  return {
    id: update.id,
    message: update.message,
    timestamp: update.createdAt ? formatDate(update.createdAt) : "Recently",
  };
}
