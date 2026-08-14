import Link from "next/link";

import { TaskSection } from "@/components/tasks/task-section";
import { MemberAvatar } from "@/components/tasks/member-avatar";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { Badge } from "@/components/ui";
import type { Project } from "@/types/project";

type ProjectDetailPageProps = {
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

export function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const totalTasks = project.tasks.reduce(
    (total, section) => total + section.tasks.length,
    0,
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <nav aria-label="Breadcrumb" className="text-caption text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="transition-colors hover:text-foreground" href="/projects">
              Projects
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="truncate font-medium text-foreground">{project.name}</li>
        </ol>
      </nav>

      <section className="rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariants[project.status]}>
            {statusLabels[project.status]}
          </Badge>
          <PriorityBadge priority={project.priority} />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {project.name}
        </h1>
        {project.description ? (
          <p className="mt-3 max-w-3xl text-body leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        ) : null}

        <dl className="mt-6 grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              Lead
            </dt>
            <dd className="mt-2 flex items-center gap-2 text-body font-medium text-foreground">
              <MemberAvatar member={project.lead} />
              <span className="truncate">{project.lead.name}</span>
            </dd>
          </div>
          <div>
            <dt className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              Due Date
            </dt>
            <dd className="mt-2 text-body font-medium text-foreground">
              {project.dueDate || "No due date"}
            </dd>
          </div>
          <div>
            <dt className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              Total Tasks
            </dt>
            <dd className="mt-2 text-body font-medium text-foreground">
              {totalTasks}
            </dd>
          </div>
        </dl>
      </section>

      <div className="space-y-4">
        {project.tasks.map((section) => (
          <TaskSection
            fields={["priority", "members", "dueDate"]}
            key={section.id}
            projects={[]}
            section={section}
          />
        ))}
      </div>
    </div>
  );
}
