import { AppShell } from "@/components/layout/app-shell";
import { TaskDetailScreen } from "@/components/tasks/task-detail-screen";

type PageProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function TaskDetailRoute({ params }: PageProps) {
  const { taskId } = await params;

  return (
    <AppShell>
      <TaskDetailScreen taskId={taskId} />
    </AppShell>
  );
}
