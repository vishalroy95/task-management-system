import { ProjectRow } from "@/components/projects/project-row";
import type { Project, ProjectField } from "@/types/project";

type ProjectTableProps = {
  fields: ProjectField[];
  onDeleteProject?: (projectId: string) => Promise<void> | void;
  onUpdateProject?: (
    projectId: string,
    project: Partial<Project>,
  ) => Promise<void> | void;
  projects: Project[];
};

const columnLabels: Record<ProjectField, string> = {
  dueDate: "Due Date",
  lead: "Lead",
  priority: "Priority",
  status: "Status",
};

export function ProjectTable({
  fields,
  onDeleteProject,
  onUpdateProject,
  projects,
}: ProjectTableProps) {
  const columns = [
    "Project",
    ...fields.map((field) => columnLabels[field]),
    "Actions",
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] border-collapse text-left text-body">
          <thead>
            <tr className="border-b border-border bg-surface-muted/60">
              {columns.map((column) => (
                <th
                  className="px-4 py-2.5 text-left text-caption font-semibold uppercase tracking-wider text-muted-foreground"
                  key={column}
                  scope="col"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {projects.map((project) => (
              <ProjectRow
                fields={fields}
                key={project.id}
                onDeleteProject={onDeleteProject}
                onUpdateProject={onUpdateProject}
                project={project}
              />
            ))}
          </tbody>
        </table>
      </div>
      {projects.length === 0 ? (
        <div className="px-4 py-12 text-center text-body text-muted-foreground">
          No projects match the current controls.
        </div>
      ) : null}
    </div>
  );
}
