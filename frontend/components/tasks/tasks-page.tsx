"use client";

import { useMemo, useState } from "react";

import { TaskBoard } from "@/components/tasks/task-board";
import { TaskSection } from "@/components/tasks/task-section";
import { TasksControls } from "@/components/tasks/tasks-controls";
import { Pagination } from "@/components/ui/pagination";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { defaultTaskFilters } from "@/lib/task-filters";
import {
  createMemberOptions,
  createReporterOptions,
  createUniqueOptions,
  dueDateOptions,
  statusOptions,
} from "@/lib/task-options";
import { groupTasksByStatus } from "@/services/api-types";
import type { Task, TaskField, TaskViewMode } from "@/types/task";
import type { TaskFilters } from "@/types/task-controls";

const defaultVisibleFields: TaskField[] = ["priority", "members", "dueDate"];

function toggleArrayValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value];
}

const statusKeywords: Record<string, string> = {
  completed: "completed done",
  doing: "doing in progress",
  on_hold: "on hold onhold paused",
  todo: "to do todo backlog",
};

const priorityKeywords: Record<string, string> = {
  high: "high",
  low: "low",
  medium: "medium med",
  none: "none no priority",
  urgent: "urgent critical",
};

function matchesTaskSearch(task: Task, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (task.title.toLowerCase().includes(q)) return true;
  if (task.description.toLowerCase().includes(q)) return true;
  if (task.team.toLowerCase().includes(q)) return true;
  if (task.dueDate.toLowerCase().includes(q)) return true;

  const statusMatch = (statusKeywords[task.status] || task.status).toLowerCase();
  if (statusMatch.includes(q)) return true;

  const priorityMatch = (priorityKeywords[task.priority] || task.priority).toLowerCase();
  if (priorityMatch.includes(q)) return true;

  if (task.labels.some((label) => label.toLowerCase().includes(q))) return true;
  if (task.members.some((member) => member.name.toLowerCase().includes(q))) return true;
  if (task.reporter.name.toLowerCase().includes(q)) return true;

  return false;
}

export function TasksPage() {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<TaskViewMode>("list");
  const [visibleFields, setVisibleFields] =
    useState<TaskField[]>(defaultVisibleFields);
  const [filters, setFilters] = useState<TaskFilters>(defaultTaskFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    createTask,
    deleteTask,
    error,
    isLoading,
    isMutating,
    tasks,
    updateTask,
  } = useTasks();
  const { projects } = useProjects();

  // Generate filter dropdown options from the entire task dataset so options don't vanish
  const memberOptions = useMemo(() => createMemberOptions(tasks), [tasks]);
  const reporterOptions = useMemo(() => createReporterOptions(tasks), [tasks]);
  const teamOptions = useMemo(
    () =>
      Array.from(
        new Map(
          tasks
            .filter((task) => task.projectId)
            .map((task) => [task.projectId ?? task.team, task.team]),
        ),
      ).map(([value, label]) => ({ label, value })),
    [tasks],
  );
  const labelOptions = useMemo(
    () => createUniqueOptions(tasks, (task) => task.labels),
    [tasks],
  );

  // Client-side filtering & search combining query with all active filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query
      if (!matchesTaskSearch(task, query)) {
        return false;
      }

      // 2. Status Filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
        return false;
      }

      // 3. Priority Filter
      if (
        filters.priorities.length > 0 &&
        !filters.priorities.includes(task.priority)
      ) {
        return false;
      }

      // 4. Member Filter
      if (filters.members.length > 0) {
        const hasMember = task.members.some(
          (m) => filters.members.includes(m.id) || filters.members.includes(m.name),
        );
        if (!hasMember) {
          return false;
        }
      }

      // 5. Due Date Ranges Filter
      if (
        filters.dueDateRanges.length > 0 &&
        !filters.dueDateRanges.includes(task.dueDateRange)
      ) {
        return false;
      }

      // 6. Teams Filter
      if (filters.teams.length > 0) {
        const matchesTeam =
          (task.projectId && filters.teams.includes(task.projectId)) ||
          filters.teams.includes(task.team);
        if (!matchesTeam) {
          return false;
        }
      }

      // 7. Labels Filter
      if (filters.labels.length > 0) {
        const hasLabel = task.labels.some((label) =>
          filters.labels.includes(label),
        );
        if (!hasLabel) {
          return false;
        }
      }

      // 8. Reporter Filter
      if (filters.reporters.length > 0) {
        const matchesReporter =
          filters.reporters.includes(task.reporter.id) ||
          filters.reporters.includes(task.reporter.name);
        if (!matchesReporter) {
          return false;
        }
      }

      return true;
    });
  }, [filters, query, tasks]);

  const totalFiltered = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  // Paginated tasks for the current page
  const paginatedTasks = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredTasks.slice(startIndex, startIndex + pageSize);
  }, [filteredTasks, safeCurrentPage, pageSize]);

  // Group into status sections for List and Board views
  const listSections = useMemo(
    () => groupTasksByStatus(paginatedTasks),
    [paginatedTasks],
  );
  const boardSections = useMemo(
    () => groupTasksByStatus(filteredTasks),
    [filteredTasks],
  );

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setCurrentPage(1);
  }

  function handleToggleField(field: TaskField) {
    setVisibleFields((currentFields) => toggleArrayValue(currentFields, field));
  }

  function handleToggleFilter<T extends keyof TaskFilters>(
    key: T,
    value: TaskFilters[T][number],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: toggleArrayValue(currentFilters[key], value),
    }));
    setCurrentPage(1);
  }

  function handleClearFilters() {
    setFilters(defaultTaskFilters);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h2 className="text-title font-semibold text-foreground">Tasks</h2>
          <p className="mt-1 text-body text-muted-foreground">
            Organize work by status, priority, members, and due dates.
          </p>
          <p className="mt-2 text-caption text-muted-foreground">
            Showing {totalFiltered} task{totalFiltered === 1 ? "" : "s"}
            {query.trim() || Object.values(filters).some((f) => f.length > 0)
              ? ` (filtered from ${tasks.length})`
              : ""}
          </p>
        </div>

        <TasksControls
          dueDateOptions={dueDateOptions}
          filters={filters}
          isMutating={isMutating}
          labelOptions={labelOptions}
          memberOptions={memberOptions}
          onClearFilters={handleClearFilters}
          onCreateTask={createTask}
          onQueryChange={handleQueryChange}
          onToggleField={handleToggleField}
          onToggleFilter={handleToggleFilter}
          onViewModeChange={setViewMode}
          projects={projects}
          query={query}
          reporterOptions={reporterOptions}
          statusOptions={statusOptions}
          teamOptions={teamOptions}
          viewMode={viewMode}
          visibleFields={visibleFields}
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-danger bg-surface p-4 text-body text-danger">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-border bg-surface p-8 text-center text-body text-muted-foreground">
          Loading tasks...
        </div>
      ) : null}

      {!isLoading && totalFiltered === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface p-8 text-center">
          <h3 className="text-body font-semibold text-foreground">No tasks found</h3>
          <p className="mt-2 text-body text-muted-foreground">
            Try clearing search or filters to see more tasks.
          </p>
        </div>
      ) : null}

      {!isLoading && totalFiltered > 0 && viewMode === "list" ? (
        <div className="space-y-4">
          <div className="space-y-4">
            {listSections.map((section) => (
              <TaskSection
                fields={visibleFields}
                key={section.id}
                onDeleteTask={deleteTask}
                onUpdateTask={(taskId, task) => updateTask(taskId, task)}
                projects={projects}
                section={section}
              />
            ))}
          </div>

          <Pagination
            currentPage={safeCurrentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSize={pageSize}
            totalItems={totalFiltered}
            totalPages={totalPages}
          />
        </div>
      ) : null}

      {!isLoading && totalFiltered > 0 && viewMode === "board" ? (
        <div className="space-y-4">
          <TaskBoard
            fields={visibleFields}
            onDeleteTask={deleteTask}
            onUpdateTask={(taskId, task) => updateTask(taskId, task)}
            projects={projects}
            sections={boardSections}
          />

          <Pagination
            currentPage={safeCurrentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSize={pageSize}
            totalItems={totalFiltered}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </div>
  );
}
