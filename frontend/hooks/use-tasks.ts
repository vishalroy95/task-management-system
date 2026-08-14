"use client";

import { useCallback, useEffect, useState } from "react";

import { notify } from "@/lib/toast";
import { groupTasksByStatus } from "@/services/api-types";
import { taskService, type TaskPayload, type TaskQuery } from "@/services/task-service";
import type { Task, TaskDetail } from "@/types/task";

const defaultEmptyQuery: TaskQuery = {};

function getTaskUpdateMessage(payload: TaskPayload): string {
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

export function useTasks(query: TaskQuery = defaultEmptyQuery) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const serializedQuery = JSON.stringify(query);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const parsedQuery = JSON.parse(serializedQuery) as TaskQuery;
      const response = await taskService.list({ limit: 100, ...parsedQuery });
      setTasks(response.data);
      setTotal(response.total);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Failed to load tasks";
      setError(message);
      notify.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [serializedQuery]);

  useEffect(() => {
    let active = true;

    async function fetchTasks() {
      try {
        const parsedQuery = JSON.parse(serializedQuery) as TaskQuery;
        const response = await taskService.list({ limit: 100, ...parsedQuery });
        if (active) {
          setTasks(response.data);
          setTotal(response.total);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error ? loadError.message : "Failed to load tasks";
          setError(message);
          notify.error(message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void fetchTasks();

    return () => {
      active = false;
    };
  }, [serializedQuery]);

  async function createTask(
    payload: TaskPayload & { projectId: string; title: string },
  ) {
    setIsMutating(true);
    setError(null);

    try {
      await taskService.create(payload);
      await loadTasks();
      notify.success("Task created successfully.");
    } catch (createError) {
      const message =
        createError instanceof Error ? createError.message : "Failed to create task";
      setError(message);
      notify.error(message);
    } finally {
      setIsMutating(false);
    }
  }

  async function updateTask(id: string, payload: TaskPayload) {
    setIsMutating(true);
    setError(null);

    try {
      await taskService.update(id, payload);
      await loadTasks();
      notify.success(getTaskUpdateMessage(payload));
    } catch (updateError) {
      const message =
        updateError instanceof Error ? updateError.message : "Failed to update task";
      setError(message);
      notify.error(message);
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteTask(id: string) {
    setIsMutating(true);
    setError(null);

    try {
      await taskService.delete(id);
      await loadTasks();
      notify.success("Task deleted successfully.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Failed to delete task";
      setError(message);
      notify.error(message);
    } finally {
      setIsMutating(false);
    }
  }

  return {
    createTask,
    deleteTask,
    error,
    isLoading,
    isMutating,
    refetch: loadTasks,
    sections: groupTasksByStatus(tasks),
    tasks,
    total,
    updateTask,
  };
}

export function useTaskDetail(taskId: string) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await taskService.getById(taskId);
      setTask(data);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Failed to load task";
      setError(message);
      notify.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    let active = true;

    if (!taskId) {
      return;
    }

    async function fetchTask() {
      try {
        const data = await taskService.getById(taskId);
        if (active) {
          setTask(data);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error ? loadError.message : "Failed to load task";
          setError(message);
          notify.error(message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void fetchTask();

    return () => {
      active = false;
    };
  }, [taskId]);

  return { error, isLoading, refetch: loadTask, task };
}
