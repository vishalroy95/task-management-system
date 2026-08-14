import { apiClient } from "@/services/api-client";

export type Workspace = {
  id: string;
  name: string;
};

export const workspaceService = {
  list() {
    return apiClient<Workspace[]>("/workspaces");
  },
};
