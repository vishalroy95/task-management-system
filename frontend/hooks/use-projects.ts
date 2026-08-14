"use client";

import { useCallback, useEffect, useState } from "react";

import { notify } from "@/lib/toast";
import {
  projectService,
  type ProjectPayload,
  type ProjectQuery,
} from "@/services/project-service";
import type { Project } from "@/types/project";

const defaultEmptyProjectQuery: ProjectQuery = {};

export function useProjects(query: ProjectQuery = defaultEmptyProjectQuery) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const serializedQuery = JSON.stringify(query);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const parsedQuery = JSON.parse(serializedQuery) as ProjectQuery;
      const response = await projectService.list(parsedQuery);
      setProjects(response.data);
      setTotal(response.total);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Failed to load projects";
      setError(message);
      notify.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [serializedQuery]);

  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      try {
        const parsedQuery = JSON.parse(serializedQuery) as ProjectQuery;
        const response = await projectService.list(parsedQuery);
        if (active) {
          setProjects(response.data);
          setTotal(response.total);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error ? loadError.message : "Failed to load projects";
          setError(message);
          notify.error(message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void fetchProjects();

    return () => {
      active = false;
    };
  }, [serializedQuery]);

  async function createProject(
    payload: ProjectPayload & { name: string; workspaceId: string },
  ) {
    setIsMutating(true);
    setError(null);

    try {
      await projectService.create(payload);
      await loadProjects();
      notify.success("Project created successfully.");
    } catch (createError) {
      const message =
        createError instanceof Error ? createError.message : "Failed to create project";
      setError(message);
      notify.error(message);
    } finally {
      setIsMutating(false);
    }
  }

  async function updateProject(id: string, payload: ProjectPayload) {
    setIsMutating(true);
    setError(null);

    try {
      await projectService.update(id, payload);
      await loadProjects();
      notify.success("Project updated successfully.");
    } catch (updateError) {
      const message =
        updateError instanceof Error ? updateError.message : "Failed to update project";
      setError(message);
      notify.error(message);
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteProject(id: string) {
    setIsMutating(true);
    setError(null);

    try {
      await projectService.delete(id);
      await loadProjects();
      notify.success("Project deleted successfully.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Failed to delete project";
      setError(message);
      notify.error(message);
    } finally {
      setIsMutating(false);
    }
  }

  return {
    createProject,
    deleteProject,
    error,
    isLoading,
    isMutating,
    projects,
    refetch: loadProjects,
    total,
    updateProject,
  };
}

export function useProjectDetail(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await projectService.getById(projectId);
      setProject(data);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Failed to load project";
      setError(message);
      notify.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let active = true;

    if (!projectId) {
      return;
    }

    async function fetchProject() {
      try {
        const data = await projectService.getById(projectId);
        if (active) {
          setProject(data);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error ? loadError.message : "Failed to load project";
          setError(message);
          notify.error(message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void fetchProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  return { error, isLoading, project, refetch: loadProject };
}
