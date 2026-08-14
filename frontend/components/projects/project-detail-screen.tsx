"use client";

import { ProjectDetailPage } from "@/components/projects/project-detail-page";
import { useProjectDetail } from "@/hooks/use-projects";

type ProjectDetailScreenProps = {
  projectId: string;
};

export function ProjectDetailScreen({ projectId }: ProjectDetailScreenProps) {
  const { error, isLoading, project } = useProjectDetail(projectId);

  if (isLoading) {
    return (
      <div className="p-6 text-body text-muted-foreground">Loading project...</div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-danger bg-surface p-4 text-body text-danger">
          {error ?? "Project not found"}
        </div>
      </div>
    );
  }

  return <ProjectDetailPage project={project} />;
}
