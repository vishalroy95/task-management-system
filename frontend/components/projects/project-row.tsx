import Link from "next/link";

import { MemberAvatar } from "@/components/tasks/member-avatar";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { Badge } from "@/components/ui";
import { ProjectActions } from "@/components/projects/project-actions";
import type { Project, ProjectField } from "@/types/project";

type ProjectRowProps = {
  fields: ProjectField[];
  onDeleteProject?: (projectId: string) => Promise<void> | void;
  onUpdateProject?: (
    projectId: string,
    project: Partial<Project>,
  ) => Promise<void> | void;
  project: Project;
};

const statusLabels: Record<Project["status"], string> = {
  active: "Active",
  completed: "Completed",
  planning: "Planning",
};

const statusVariants: Record<
  Project["status"],
  "default" | "primary" | "success"
> = {
  active: "primary",
  completed: "success",
  planning: "default",
};

export function ProjectRow({
  fields,
  onDeleteProject,
  project,
}: ProjectRowProps) {
  return (
    <tr className="border-b border-border transition-colors hover:bg-surface-muted/50 last:border-b-0">
      <td className="min-w-64 px-4 py-3 align-middle">
        <Link
          className="line-clamp-1 text-body font-medium text-foreground transition-colors hover:text-primary"
          href={`/projects/${project.id}`}
        >
          {project.name}
        </Link>
        {project.description ? (
          <p className="mt-0.5 line-clamp-1 max-w-xl text-caption text-muted-foreground">
            {project.description}
          </p>
        ) : null}
      </td>
      {fields.includes("priority") ? (
        <td className="px-4 py-3 align-middle">
          <PriorityBadge priority={project.priority} />
        </td>
      ) : null}
      {fields.includes("lead") ? (
        <td className="px-4 py-3 align-middle">
          <span className="flex items-center gap-2 text-body text-foreground">
            <MemberAvatar member={project.lead} />
            <span className="truncate">{project.lead.name}</span>
          </span>
        </td>
      ) : null}
      {fields.includes("dueDate") ? (
        <td className="whitespace-nowrap px-4 py-3 align-middle text-body text-muted-foreground">
          {project.dueDate || "No due date"}
        </td>
      ) : null}
      {fields.includes("status") ? (
        <td className="whitespace-nowrap px-4 py-3 align-middle">
          <Badge variant={statusVariants[project.status]}>
            {statusLabels[project.status]}
          </Badge>
        </td>
      ) : null}
      <td className="px-4 py-3 text-right align-middle">
        <ProjectActions
          onDelete={() => onDeleteProject?.(project.id)}
          projectName={project.name}
        />
      </td>
    </tr>
  );
}
