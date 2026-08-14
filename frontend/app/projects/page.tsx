import { AppShell } from "@/components/layout/app-shell";
import { ProjectsPage } from "@/components/projects/projects-page";

export default function ProjectsRoute() {
  return (
    <AppShell activeItemId="projects">
      <ProjectsPage />
    </AppShell>
  );
}
