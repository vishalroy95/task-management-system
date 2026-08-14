"use client";

import { CheckboxMenuItem, Dropdown } from "@/components/ui";
import type { Project } from "@/types/project";

type ProjectSelectorProps = {
  onChange?: (projectId: string) => void;
  projects: Project[];
  selectedProjectId?: string;
  triggerClassName?: string;
};

export function ProjectSelector({
  onChange,
  projects,
  selectedProjectId,
  triggerClassName,
}: ProjectSelectorProps) {
  const currentProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const labelText = currentProject?.name ?? "Select Project";

  return (
    <Dropdown
      align="left"
      label={<span className="truncate">{labelText}</span>}
      panelClassName="w-56"
      triggerClassName={triggerClassName ?? "min-w-36 justify-between"}
    >
      <div className="space-y-1" role="menu">
        {projects.map((project) => {
          const isSelected = project.id === selectedProjectId;

          return (
            <CheckboxMenuItem
              checked={isSelected}
              key={project.id}
              label={project.name}
              onClick={() => onChange?.(project.id)}
            />
          );
        })}
      </div>
    </Dropdown>
  );
}
