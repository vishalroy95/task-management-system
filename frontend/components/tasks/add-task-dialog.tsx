"use client";

import { useEffect, useMemo, useState } from "react";

import { ProjectSelector } from "@/components/tasks/project-selector";
import { Button, Input } from "@/components/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { parseDisplayDate } from "@/lib/date";
import type { Project } from "@/types/project";
import type { TaskPriority, TaskStatus } from "@/types/task";

type AddTaskDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (payload: {
    description?: string;
    dueDate?: string;
    priority?: TaskPriority;
    projectId: string;
    status?: TaskStatus;
    title: string;
  }) => Promise<void> | void;
  projects: Project[];
};

type FormValues = {
  assignee: string;
  description: string;
  dueDate: string;
  labels: string;
  priority: TaskPriority;
  projectId: string;
  status: TaskStatus;
  title: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const assigneeOptions = [
  "Unassigned",
  "Alex Morgan",
  "Priya Nair",
  "Marcus Lee",
  "Sofia Chen",
];

const initialValues = (projects: Project[]): FormValues => ({
  assignee: "Unassigned",
  description: "",
  dueDate: "",
  labels: "",
  priority: "medium",
  projectId: projects.length > 0 ? projects[0].id : "",
  status: "todo",
  title: "",
});

export function AddTaskDialog({
  isOpen,
  onClose,
  onCreate,
  projects,
}: AddTaskDialogProps) {
  const [formValues, setFormValues] = useState<FormValues>(() => initialValues(projects));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && projects.length > 0 && !formValues.projectId) {
      setTimeout(() => {
        setFormValues((current) => ({ ...current, projectId: projects[0].id }));
      }, 0);
    }
  }, [isOpen, projects, formValues.projectId]);

  const projectOptions: Project[] = useMemo(
    () => projects,
    [projects],
  );

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!formValues.title.trim()) {
      nextErrors.title = "Task title is required.";
    }

    if (!formValues.projectId || projects.length === 0) {
      nextErrors.projectId = "Please select a valid project.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Double-check projectId before submission
    if (!formValues.projectId || formValues.projectId === "default" || projects.length === 0) {
      setErrors({ projectId: "Please select a valid project." });
      return;
    }

    await onCreate?.({
      description: formValues.description.trim() || undefined,
      dueDate: formValues.dueDate.trim() || undefined,
      priority: formValues.priority,
      projectId: formValues.projectId,
      status: formValues.status,
      title: formValues.title.trim(),
    });

    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-surface shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Create task
            </p>
            <h2 className="mt-1 text-title font-semibold text-foreground">Add Task</h2>
          </div>
          <button
            aria-label="Close add task dialog"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-5 p-5 overflow-y-auto flex-1" noValidate onSubmit={handleSubmit}>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Task title</span>
              <Input
                className="h-11 rounded-lg border-border px-3.5 text-sm shadow-xs"
                isInvalid={Boolean(errors.title)}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Enter task title"
                value={formValues.title}
              />
              {errors.title ? <span className="text-sm text-danger">{errors.title}</span> : null}
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Description</span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Add details for this task"
                value={formValues.description}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Project</span>
              {projects.length === 0 ? (
                <div className="h-11 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground">
                  No projects available
                </div>
              ) : (
                <ProjectSelector
                  onChange={(nextProjectId) => updateField("projectId", nextProjectId)}
                  projects={projectOptions}
                  selectedProjectId={formValues.projectId}
                  triggerClassName="h-11 w-full justify-between rounded-lg border border-border bg-surface px-3 text-sm shadow-xs hover:bg-surface-muted min-w-0"
                />
              )}
              {errors.projectId ? (
                <span className="text-sm text-danger">{errors.projectId}</span>
              ) : null}
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Status</span>
              <select
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none min-w-0"
                onChange={(event) => updateField("status", event.target.value as TaskStatus)}
                value={formValues.status}
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Priority</span>
              <select
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none min-w-0"
                onChange={(event) => updateField("priority", event.target.value as TaskPriority)}
                value={formValues.priority}
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Assignee</span>
              <select
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none min-w-0"
                onChange={(event) => updateField("assignee", event.target.value)}
                value={formValues.assignee}
              >
                {assigneeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Due date</span>
              <DatePicker
                onChange={(date) => updateField("dueDate", date.toISOString().slice(0, 10))}
                value={formValues.dueDate ? parseDisplayDate(formValues.dueDate) : undefined}
              />
            </div>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Labels</span>
              <Input
                className="h-11 rounded-lg border-border px-3.5 text-sm shadow-xs"
                onChange={(event) => updateField("labels", event.target.value)}
                placeholder="Design, Frontend, Sprint"
                value={formValues.labels}
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end shrink-0">
            <Button onClick={onClose} type="button" variant="secondary">
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
