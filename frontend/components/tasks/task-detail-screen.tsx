"use client";

import { useState } from "react";

import { TaskDetailPage } from "@/components/tasks/task-detail-page";
import { useTaskDetail } from "@/hooks/use-tasks";
import { notify } from "@/lib/toast";
import { commentService } from "@/services/comment-service";
import { taskService, type TaskPayload } from "@/services/task-service";

function getTaskUpdateMessage(payload: Partial<TaskPayload>): string {
  const keys = Object.keys(payload).filter(
    (key) => payload[key as keyof TaskPayload] !== undefined,
  );
  if (keys.length === 1) {
    if (keys[0] === "status") return "Status updated.";
    if (keys[0] === "priority") return "Priority updated.";
    if (keys[0] === "memberIds" || keys[0] === "members") return "Assignee updated.";
    if (keys[0] === "labelIds" || keys[0] === "labels") return "Labels updated.";
    if (keys[0] === "dueDate") return "Due date updated.";
  }
  return "Task updated successfully.";
}

type TaskDetailScreenProps = {
  taskId: string;
};

export function TaskDetailScreen({ taskId }: TaskDetailScreenProps) {
  const { error, isLoading, refetch, task } = useTaskDetail(taskId);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 text-body text-muted-foreground">Loading task...</div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-danger bg-surface p-4 text-body text-danger">
          {error ?? "Task not found"}
        </div>
      </div>
    );
  }

  return (
    <TaskDetailPage
      isSubmittingComment={isSubmittingComment}
      onCreateComment={async (message) => {
        setIsSubmittingComment(true);
        try {
          await commentService.create({ body: message, taskId });
          await refetch();
          notify.success("Comment added successfully.");
        } catch (commentError) {
          const errMsg =
            commentError instanceof Error
              ? commentError.message
              : "Failed to add comment";
          notify.error(errMsg);
        } finally {
          setIsSubmittingComment(false);
        }
      }}
      onUpdateTask={async (payload) => {
        try {
          await taskService.update(taskId, payload);
          await refetch();
          notify.success(getTaskUpdateMessage(payload));
        } catch (updateError) {
          const errMsg =
            updateError instanceof Error
              ? updateError.message
              : "Failed to update task";
          notify.error(errMsg);
        }
      }}
      task={task}
    />
  );
}
