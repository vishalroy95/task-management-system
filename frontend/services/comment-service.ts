import { apiClient } from "@/services/api-client";

export type CommentPayload = {
  authorId?: string;
  body: string;
  taskId: string;
};

export const commentService = {
  create(payload: CommentPayload) {
    return apiClient<unknown>("/comments", {
      body: payload,
      method: "POST",
    });
  },
};
