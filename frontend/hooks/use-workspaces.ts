"use client";

import { useCallback, useEffect, useState } from "react";

import { workspaceService, type Workspace } from "@/services/workspace-service";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkspaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setWorkspaces(await workspaceService.list());
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load workspaces",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchWorkspaces() {
      try {
        const data = await workspaceService.list();
        if (active) {
          setWorkspaces(data);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load workspaces",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void fetchWorkspaces();

    return () => {
      active = false;
    };
  }, []);

  return { error, isLoading, refetch: loadWorkspaces, workspaces };
}
