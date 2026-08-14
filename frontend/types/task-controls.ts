import type { TaskDueDateRange, TaskField, TaskPriority, TaskStatus, TaskViewMode } from "@/types/task";

export type TaskFilters = {
  dueDateRanges: TaskDueDateRange[];
  labels: string[];
  members: string[];
  priorities: TaskPriority[];
  reporters: string[];
  statuses: TaskStatus[];
  teams: string[];
};

export type TaskControlsState = {
  filters: TaskFilters;
  query: string;
  viewMode: TaskViewMode;
  visibleFields: TaskField[];
};
