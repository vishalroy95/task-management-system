import Link from "next/link";
import { useState } from "react";

import { AssigneeSelector } from "@/components/tasks/assignee-selector";
import { LabelsSelector } from "@/components/tasks/labels-selector";
import { PrioritySelector } from "@/components/tasks/priority-selector";
import { StatusSelector } from "@/components/tasks/status-selector";
import { CommentList } from "@/components/tasks/comment-list";
import { DetailsSidebar } from "@/components/tasks/details-sidebar";
import { ResourceList } from "@/components/tasks/resource-list";
import { SubtaskTable } from "@/components/tasks/subtask-table";
import { UpdateList } from "@/components/tasks/update-list";
import { formatDisplayDate, parseDisplayDate } from "@/lib/date";
import type { TaskDetail, TaskPriority, TaskStatus } from "@/types/task";

type TaskDetailPageProps = {
  isSubmittingComment?: boolean;
  onCreateComment?: (message: string) => Promise<void> | void;
  onUpdateTask?: (payload: {
    memberIds?: string[];
    priority?: TaskPriority;
    status?: TaskStatus;
  }) => Promise<void> | void;
  task: TaskDetail;
};

export function TaskDetailPage({
  isSubmittingComment = false,
  onCreateComment,
  onUpdateTask,
  task,
}: TaskDetailPageProps) {
  const [members, setMembers] = useState(task.members);
  const [labels, setLabels] = useState(task.labels);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <nav aria-label="Breadcrumb" className="text-caption text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="hover:text-foreground" href="/tasks">
              Tasks
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="truncate text-foreground">{task.title}</li>
        </ol>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-lg border border-border bg-surface p-5 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <StatusSelector
                onChange={(nextStatus) => {
                  setStatus(nextStatus);
                  void onUpdateTask?.({ status: nextStatus });
                }}
                selectedStatus={status}
              />
              <PrioritySelector
                onChange={(nextPriority) => {
                  setPriority(nextPriority);
                  void onUpdateTask?.({ priority: nextPriority });
                }}
                value={priority}
              />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-foreground">
              {task.title}
            </h1>
            <p className="mt-3 max-w-3xl text-body leading-7 text-muted-foreground">
              {task.description}
            </p>

            <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-caption font-medium uppercase text-muted-foreground">
                  Assignee
                </dt>
                <dd className="mt-2 text-body text-foreground">
                  <AssigneeSelector
                    members={task.members}
                    onSelect={(nextMember) => {
                      const nextMembers = nextMember ? [nextMember] : [];
                      setMembers(nextMembers);
                      void onUpdateTask?.({
                        memberIds: nextMember && nextMember.id !== "unassigned" ? [nextMember.id] : [],
                      });
                    }}
                    selectedMember={members[0] ?? null}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-caption font-medium uppercase text-muted-foreground">
                  Due Date
                </dt>
                <dd className="mt-2 text-body text-foreground">
                  {task.dueDate ? formatDisplayDate(parseDisplayDate(task.dueDate)) : "No due date"}
                </dd>
              </div>
              <div>
                <dt className="text-caption font-medium uppercase text-muted-foreground">
                  Team
                </dt>
                <dd className="mt-2 text-body text-foreground">{task.team}</dd>
              </div>
              <div>
                <dt className="text-caption font-medium uppercase text-muted-foreground">
                  Reporter
                </dt>
                <dd className="mt-2 text-body text-foreground">
                  {task.reporter.name}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <LabelsSelector
                availableLabels={task.labels}
                onChange={(nextLabels) => {
                  setLabels(nextLabels);
                }}
                selectedLabels={labels}
              />
            </div>
          </section>

          <ResourceList resources={task.resources} />
          <SubtaskTable subtasks={task.subtasks} />
          <CommentList
            comments={task.comments}
            isSubmitting={isSubmittingComment}
            onSubmit={onCreateComment}
          />
          <UpdateList updates={task.updates} />
        </div>

        <DetailsSidebar task={task} />
      </div>
    </div>
  );
}
