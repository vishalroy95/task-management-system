"use client";

import { useState } from "react";

import { AddTaskDialog } from "@/components/tasks/add-task-dialog";
import { Button, CheckboxMenuItem, Dropdown, Input, MenuSection } from "@/components/ui";
import { PrioritySelector } from "@/components/tasks/priority-selector";
import type { FilterOption } from "@/lib/task-options";
import type { Project } from "@/types/project";
import type {
  TaskDueDateRange,
  TaskField,
  TaskPriority,
  TaskStatus,
  TaskViewMode,
} from "@/types/task";
import type { TaskFilters } from "@/types/task-controls";

type TasksControlsProps = {
  dueDateOptions: FilterOption<TaskDueDateRange>[];
  filters: TaskFilters;
  labelOptions: FilterOption[];
  memberOptions: FilterOption[];
  isMutating?: boolean;
  onClearFilters: () => void;
  onCreateTask?: (payload: {
    description?: string;
    dueDate?: string;
    priority?: TaskPriority;
    projectId: string;
    status?: TaskStatus;
    title: string;
  }) => Promise<void> | void;
  onQueryChange: (query: string) => void;
  projects: Project[];
  onToggleField: (field: TaskField) => void;
  onToggleFilter: <T extends keyof TaskFilters>(
    key: T,
    value: TaskFilters[T][number],
  ) => void;
  onViewModeChange: (viewMode: TaskViewMode) => void;
  query: string;
  reporterOptions: FilterOption[];
  statusOptions: FilterOption<TaskStatus>[];
  teamOptions: FilterOption[];
  viewMode: TaskViewMode;
  visibleFields: TaskField[];
};

const fieldOptions: { field: TaskField; label: string }[] = [
  { field: "priority", label: "Priority" },
  { field: "members", label: "Members" },
  { field: "dueDate", label: "Due Date" },
  { field: "labels", label: "Labels" },
  { field: "status", label: "Status" },
  { field: "reporter", label: "Reporter" },
];

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

function renderFilterOptions<T extends string>(
  options: FilterOption<T>[],
  selectedValues: T[],
  onToggle: (value: T) => void,
) {
  return options.map((option) => (
    <CheckboxMenuItem
      checked={selectedValues.includes(option.value)}
      key={option.value}
      label={option.label}
      onClick={() => onToggle(option.value)}
    />
  ));
}

export function TasksControls({
  dueDateOptions,
  filters,
  labelOptions,
  memberOptions,
  isMutating = false,
  onClearFilters,
  onCreateTask,
  onQueryChange,
  onToggleField,
  onToggleFilter,
  onViewModeChange,
  projects,
  query,
  reporterOptions,
  statusOptions,
  teamOptions,
  viewMode,
  visibleFields,
}: TasksControlsProps) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 lg:items-end">
        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SearchIcon />
          </span>
          <Input
            aria-label="Search tasks"
            className="pr-9 pl-9"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search tasks"
            value={query}
          />
          {query ? (
            <button
              aria-label="Clear search"
              className="absolute right-2 top-1/2 size-6 -translate-y-1/2 rounded-sm text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              onClick={() => onQueryChange("")}
              type="button"
            >
              x
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
        <Dropdown
          label={
            <>
              <FieldsIcon />
              Fields
            </>
          }
        >
          <MenuSection title="View">
            <CheckboxMenuItem
              checked={viewMode === "list"}
              label="List"
              onClick={() => onViewModeChange("list")}
            />
            <CheckboxMenuItem
              checked={viewMode === "board"}
              label="Board"
              onClick={() => onViewModeChange("board")}
            />
          </MenuSection>
          <MenuSection title="Fields">
            {fieldOptions.map((option) => (
              <CheckboxMenuItem
                checked={visibleFields.includes(option.field)}
                key={option.field}
                label={option.label}
                onClick={() => onToggleField(option.field)}
              />
            ))}
          </MenuSection>
        </Dropdown>

        <Dropdown
          label={
            <>
              <FilterIcon />
              Filter
            </>
          }
        >
          <MenuSection title="Status">
            {renderFilterOptions(statusOptions, filters.statuses, (value) =>
              onToggleFilter("statuses", value),
            )}
          </MenuSection>
          <MenuSection title="Priority">
            <PrioritySelector
              mode="multiple"
              onChange={(priorities) => {
                priorities.forEach((priority) => {
                  if (!filters.priorities.includes(priority)) {
                    onToggleFilter("priorities", priority);
                  }
                });
                filters.priorities.forEach((priority) => {
                  if (!priorities.includes(priority)) {
                    onToggleFilter("priorities", priority);
                  }
                });
              }}
              value={filters.priorities}
            />
          </MenuSection>
          <MenuSection title="Members">
            {renderFilterOptions(memberOptions, filters.members, (value) =>
              onToggleFilter("members", value),
            )}
          </MenuSection>
          <MenuSection title="Due Date">
            {renderFilterOptions(
              dueDateOptions,
              filters.dueDateRanges,
              (value) => onToggleFilter("dueDateRanges", value),
            )}
          </MenuSection>
          <MenuSection title="Teams">
            {renderFilterOptions(teamOptions, filters.teams, (value) =>
              onToggleFilter("teams", value),
            )}
          </MenuSection>
          <MenuSection title="Labels">
            {renderFilterOptions(labelOptions, filters.labels, (value) =>
              onToggleFilter("labels", value),
            )}
          </MenuSection>
          <MenuSection title="Reporter">
            {renderFilterOptions(
              reporterOptions,
              filters.reporters,
              (value) => onToggleFilter("reporters", value),
            )}
          </MenuSection>
          <div className="border-t border-border pt-2">
            <Button className="w-full" onClick={onClearFilters} size="sm" variant="ghost">
              Clear filters
            </Button>
          </div>
        </Dropdown>

          <Button disabled={isMutating} onClick={() => setIsAddTaskOpen(true)} size="sm">
            <PlusIcon />
            {isMutating ? "Saving" : "Add Task"}
          </Button>
        </div>
      </div>

      <AddTaskDialog
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onCreate={onCreateTask}
        projects={projects}
      />
    </>
  );
}
