"use client";

import { useEffect, useMemo, useState } from "react";

import { AssigneeSelector } from "@/components/tasks/assignee-selector";
import { LabelsSelector } from "@/components/tasks/labels-selector";
import { PrioritySelector } from "@/components/tasks/priority-selector";
import { ProjectSelector } from "@/components/tasks/project-selector";
import { StatusSelector } from "@/components/tasks/status-selector";
import { Button, Input } from "@/components/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { parseDisplayDate } from "@/lib/date";
import type { Project } from "@/types/project";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

type EditTaskDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => Promise<void> | void;
  projects: Project[];
  task: Task;
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

function getInitialValues(task: Task, projects: Project[]): FormValues {
  const initialDueDate =
    task.dueDate && task.dueDate !== "No due date"
      ? parseDisplayDate(task.dueDate).toISOString().slice(0, 10)
      : "";

  return {
    assignee: task.members[0]?.name ?? "Unassigned",
    description: task.description ?? "",
    dueDate: initialDueDate,
    labels: task.labels.join(", "),
    priority: task.priority,
    projectId: task.projectId ?? projects[0]?.id ?? "",
    status: task.status,
    title: task.title,
  };
}

export function EditTaskDialog({
  isOpen,
  onClose,
  onSave,
  projects,
  task,
}: EditTaskDialogProps) {
  const [formValues, setFormValues] = useState<FormValues>(() =>
    getInitialValues(task, projects),
  );
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

    if (!formValues.projectId) {
      nextErrors.projectId = "Project is required.";
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

    const nextLabels = formValues.labels
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);

    const nextMembers =
      formValues.assignee === "Unassigned"
        ? []
        : task.members.filter((member) => member.name === formValues.assignee);

    const formattedDueDate = formValues.dueDate.trim()
      ? formValues.dueDate.includes("-")
        ? formValues.dueDate.trim()
        : parseDisplayDate(formValues.dueDate).toISOString().slice(0, 10)
      : undefined;

    await onSave({
      description: formValues.description.trim() || undefined,
      dueDate: formattedDueDate,
      labels: nextLabels.length > 0 ? nextLabels : task.labels,
      members: nextMembers.length > 0 ? nextMembers : task.members,
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
              Update task
            </p>
            <h2 className="mt-1 text-title font-semibold text-foreground">Edit Task</h2>
          </div>
          <button
            aria-label="Close edit task dialog"
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
              <ProjectSelector
                onChange={(nextProjectId) => updateField("projectId", nextProjectId)}
                projects={projectOptions}
                selectedProjectId={formValues.projectId}
                triggerClassName="h-11 w-full justify-between rounded-lg border border-border bg-surface px-3 text-sm shadow-xs hover:bg-surface-muted"
              />
              {errors.projectId ? (
                <span className="text-sm text-danger">{errors.projectId}</span>
              ) : null}
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Status</span>
              <StatusSelector
                onChange={(nextStatus) => {
                  updateField("status", nextStatus);
                }}
                selectedStatus={formValues.status}
                triggerClassName="h-11 w-full justify-start rounded-lg border border-border bg-surface px-3 text-sm shadow-xs hover:bg-surface-muted min-w-0"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Priority</span>
              <PrioritySelector
                onChange={(nextPriority) => {
                  updateField("priority", nextPriority);
                }}
                triggerClassName="h-11 w-full justify-start rounded-lg border border-border bg-surface px-3 text-sm shadow-xs hover:bg-surface-muted"
                value={formValues.priority}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Assignee</span>
              <AssigneeSelector
                members={task.members}
                onSelect={(nextMember) => {
                  updateField("assignee", nextMember?.name ?? "Unassigned");
                }}
                selectedMember={task.members.find((member) => member.name === formValues.assignee) ?? null}
                triggerClassName="h-11 w-full justify-between rounded-lg border border-border bg-surface px-3 text-sm shadow-xs hover:bg-surface-muted"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Due date</span>
              <DatePicker
                onChange={(date) => updateField("dueDate", date.toISOString().slice(0, 10))}
                value={formValues.dueDate ? parseDisplayDate(formValues.dueDate) : undefined}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Labels</span>
              <LabelsSelector
                availableLabels={task.labels}
                onChange={(nextLabels) => {
                  updateField("labels", nextLabels.join(", "));
                }}
                selectedLabels={formValues.labels
                  .split(",")
                  .map((label) => label.trim())
                  .filter(Boolean)}
                triggerClassName="w-full justify-start rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-xs hover:bg-surface-muted"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end shrink-0">
            <Button onClick={onClose} type="button" variant="secondary">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
