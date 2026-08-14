import { apiClient, type ApiListResponse } from "@/services/api-client";
import { mapApiProject, type ApiProject } from "@/services/api-types";
import type { Project } from "@/types/project";
import type { TaskPriority } from "@/types/task";

export type ProjectQuery = {
  priority?: TaskPriority;
  search?: string;
  status?: Project["status"];
};

export type ProjectPayload = {
  description?: string;
  dueDate?: string;
  leadId?: string;
  name?: string;
  priority?: TaskPriority;
  status?: Project["status"];
  teamId?: string;
  workspaceId?: string;
};

export const projectService = {
  async create(payload: ProjectPayload & { name: string; workspaceId: string }) {
    const project = await apiClient<ApiProject>("/projects", {
      body: payload,
      method: "POST",
    });
    return mapApiProject(project);
  },

  delete(id: string) {
    return apiClient<void>(`/projects/${id}`, { method: "DELETE" });
  },

  async getById(id: string) {
    const project = await apiClient<ApiProject>(`/projects/${id}`);
    return mapApiProject(project);
  },

  async list(query: ProjectQuery = {}) {
    const response = await apiClient<ApiListResponse<ApiProject>>("/projects", {
      query,
    });
    return {
      data: response.data.map(mapApiProject),
      total: response.total,
    };
  },

  async update(id: string, payload: ProjectPayload) {
    const project = await apiClient<ApiProject>(`/projects/${id}`, {
      body: payload,
      method: "PATCH",
    });
    return mapApiProject(project);
  },
};
