"use client";

import { useMemo, useState } from "react";

import { ProjectTable } from "@/components/projects/project-table";
import { Button, CheckboxMenuItem, Dropdown, Input, MenuSection } from "@/components/ui";
import { useProjects } from "@/hooks/use-projects";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { priorityOptions } from "@/lib/task-options";
import type { ProjectField } from "@/types/project";
import type { TaskPriority } from "@/types/task";

const defaultFields: ProjectField[] = ["priority", "lead", "dueDate"];

const fieldOptions: { field: ProjectField; label: string }[] = [
  { field: "priority", label: "Priority" },
  { field: "lead", label: "Lead" },
  { field: "dueDate", label: "Due Date" },
  { field: "status", label: "Status" },
];

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FieldsIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 6h16M4 12h16M4 18h16M8 4v16M16 4v16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [visibleFields, setVisibleFields] = useState<ProjectField[]>(defaultFields);
  const [priorities, setPriorities] = useState<TaskPriority[]>([]);

  const projectQuery = useMemo(
    () => ({
      priority: priorities[0],
      search: query,
    }),
    [priorities, query],
  );
  const {
    createProject,
    deleteProject,
    error,
    isLoading,
    isMutating,
    projects,
    total,
    updateProject,
  } = useProjects(projectQuery);
  const { workspaces } = useWorkspaces();
  const effectiveWorkspaceId = workspaces[0]?.id ?? "ag-workspace";

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h2 className="text-title font-semibold text-foreground">Projects</h2>
          <p className="mt-1 text-body text-muted-foreground">
            Track project ownership, priority, and deadlines.
          </p>
          <p className="mt-2 text-caption text-muted-foreground">
            Showing {total} project{total === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="relative w-full sm:w-72">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <SearchIcon />
            </span>
            <Input
              aria-label="Search projects"
              className="pr-9 pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              value={query}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Dropdown label={<><FieldsIcon />Fields</>}>
              <MenuSection title="Fields">
                {fieldOptions.map((option) => (
                  <CheckboxMenuItem
                    checked={visibleFields.includes(option.field)}
                    key={option.field}
                    label={option.label}
                    onClick={() =>
                      setVisibleFields((current) => toggleValue(current, option.field))
                    }
                  />
                ))}
              </MenuSection>
            </Dropdown>

            <Dropdown label={<><FilterIcon />Filter</>}>
              <MenuSection title="Priority">
                {priorityOptions.map((option) => (
                  <CheckboxMenuItem
                    checked={priorities.includes(option.value)}
                    key={option.value}
                    label={option.label}
                    onClick={() =>
                      setPriorities((current) => toggleValue(current, option.value))
                    }
                  />
                ))}
              </MenuSection>
              <div className="border-t border-border pt-2">
                <Button
                  className="w-full"
                  onClick={() => setPriorities([])}
                  size="sm"
                  variant="ghost"
                >
                  Clear filters
                </Button>
              </div>
            </Dropdown>

            <Button
              disabled={isMutating}
              onClick={() =>
                void createProject({
                  name: "Untitled project",
                  priority: "none",
                  status: "planning",
                  workspaceId: effectiveWorkspaceId,
                })
              }
              size="sm"
            >
              <PlusIcon />
              {isMutating ? "Saving" : "Add Project"}
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-danger bg-surface p-4 text-body text-danger">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-border bg-surface p-8 text-center text-body text-muted-foreground">
          Loading projects...
        </div>
      ) : (
        <ProjectTable
          fields={visibleFields}
          onDeleteProject={deleteProject}
          onUpdateProject={(projectId, project) => updateProject(projectId, project)}
          projects={projects}
        />
      )}
    </div>
  );
}
