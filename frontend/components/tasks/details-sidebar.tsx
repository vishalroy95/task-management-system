"use client";

import { useState } from "react";

import { AssigneeSelector } from "@/components/tasks/assignee-selector";
import { LabelsSelector } from "@/components/tasks/labels-selector";
import { StatusSelector } from "@/components/tasks/status-selector";
import { TeamSelector } from "@/components/tasks/team-selector";
import { DatePicker } from "@/components/ui/date-picker";
import { DetailProperty } from "@/components/tasks/detail-property";
import { MemberAvatar } from "@/components/tasks/member-avatar";
import { PrioritySelector } from "@/components/tasks/priority-selector";
import { parseDisplayDate } from "@/lib/date";
import type { TaskDetail } from "@/types/task";

type DetailsSidebarProps = {
  task: TaskDetail;
};

export function DetailsSidebar({ task }: DetailsSidebarProps) {
  const [priority, setPriority] = useState(task.priority);
  const [dateRange, setDateRange] = useState<{ end?: Date; start?: Date }>({
    start: parseDisplayDate(task.dueDate),
  });
  const [members, setMembers] = useState(task.members);
  const [labels, setLabels] = useState(task.labels);
  const [status, setStatus] = useState(task.status);
  const [team, setTeam] = useState(task.team);

  return (
    <aside className="rounded-lg border border-border bg-surface shadow-xs">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-body font-semibold text-foreground">Details</h2>
      </div>
      <dl className="divide-y divide-border px-4 py-2">
        <DetailProperty label="Status">
          <StatusSelector
            onChange={(nextStatus) => {
              setStatus(nextStatus);
            }}
            selectedStatus={status}
          />
        </DetailProperty>
        <DetailProperty label="Priority">
          <PrioritySelector onChange={setPriority} value={priority} />
        </DetailProperty>
        <DetailProperty label="Members">
          <AssigneeSelector
            members={task.members}
            onSelect={(nextMember) => {
              setMembers(nextMember ? [nextMember] : []);
            }}
            selectedMember={members[0] ?? null}
          />
        </DetailProperty>
        <DetailProperty label="Dates">
          <DatePicker mode="range" onChange={setDateRange} value={dateRange} />
        </DetailProperty>
        <DetailProperty label="Labels">
          <LabelsSelector
            availableLabels={task.labels}
            onChange={(nextLabels) => {
              setLabels(nextLabels);
            }}
            selectedLabels={labels}
          />
        </DetailProperty>
        <DetailProperty label="Teams">
          <TeamSelector
            onChange={setTeam}
            selectedTeam={team}
            triggerClassName="h-8 justify-start rounded-md border border-border bg-surface px-3 text-caption shadow-xs hover:bg-surface-muted"
          />
        </DetailProperty>
        <DetailProperty label="Reporter">
          <span className="flex items-center gap-2">
            <MemberAvatar member={task.reporter} />
            <span className="truncate">{task.reporter.name}</span>
          </span>
        </DetailProperty>
      </dl>
    </aside>
  );
}
