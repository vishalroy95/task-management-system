import { AppShell } from "@/components/layout/app-shell";
import { ProjectDetailScreen } from "@/components/projects/project-detail-screen";

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectDetailRoute({ params }: PageProps) {
  const { projectId } = await params;

  return (
    <AppShell activeItemId="projects">
      <ProjectDetailScreen projectId={projectId} />
    </AppShell>
  );
}
