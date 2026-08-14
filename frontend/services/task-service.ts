import { apiClient, type ApiListResponse } from "@/services/api-client";
import { mapApiTask, mapApiTaskDetail, type ApiTask } from "@/services/api-types";
import type { TaskPriority, TaskStatus } from "@/types/task";

export type TaskQuery = {
  dueDate?: string;
  labelId?: string;
  limit?: number;
  memberId?: string;
  offset?: number;
  priority?: TaskPriority;
  projectId?: string;
  search?: string;
  status?: TaskStatus;
};

export type TaskPayload = {
  description?: string;
  dueDate?: string;
  labelIds?: string[];
  memberIds?: string[];
  priority?: TaskPriority;
  projectId?: string;
  reporterId?: string;
  status?: TaskStatus;
  title?: string;
};

export const taskService = {
  async create(payload: TaskPayload & { projectId: string; title: string }) {
    const task = await apiClient<ApiTask>("/tasks", {
      body: payload,
      method: "POST",
    });
    return mapApiTask(task);
  },

  delete(id: string) {
    return apiClient<void>(`/tasks/${id}`, { method: "DELETE" });
  },

  async getById(id: string) {
    const task = await apiClient<ApiTask>(`/tasks/${id}`);
    return mapApiTaskDetail(task);
  },

  async list(query: TaskQuery = {}) {
    const response = await apiClient<ApiListResponse<ApiTask>>("/tasks", { query });
    return {
      data: response.data.map(mapApiTask),
      total: response.total,
    };
  },

  async update(id: string, payload: TaskPayload) {
    const task = await apiClient<ApiTask>(`/tasks/${id}`, {
      body: payload,
      method: "PATCH",
    });
    return mapApiTask(task);
  },
};
