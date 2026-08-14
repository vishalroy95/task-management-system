"use client";

import { useMemo, useState } from "react";

import { Dropdown } from "@/components/ui";
import { MemberAvatar } from "@/components/tasks/member-avatar";
import { cn } from "@/lib/cn";
import type { TaskMember } from "@/types/task";

type AssigneeSelectorProps = {
  members: TaskMember[];
  onSelect?: (member: TaskMember | null) => void;
  selectedMember?: TaskMember | null;
  triggerClassName?: string;
};

const unassignedMember: TaskMember = {
  id: "__unassigned__",
  initials: "NA",
  name: "Unassigned",
};

export function AssigneeSelector({
  members,
  onSelect,
  selectedMember = null,
  triggerClassName,
}: AssigneeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = useMemo(() => {
    const uniqueMembers = new Map<string, TaskMember>();

    [selectedMember, ...members].forEach((member) => {
      if (!member) {
        return;
      }

      if (!uniqueMembers.has(member.id)) {
        uniqueMembers.set(member.id, member);
      }
    });

    return [unassignedMember, ...Array.from(uniqueMembers.values())].filter(
      (member, index, list) =>
        index === list.findIndex((candidate) => candidate.id === member.id),
    );
  }, [members, selectedMember]);

  const currentMember = selectedMember ?? unassignedMember;

  return (
    <Dropdown
      align="left"
      isOpen={isOpen}
      label={
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-left text-body text-foreground transition-colors hover:bg-surface-muted",
            triggerClassName,
          )}
        >
          <MemberAvatar className="shrink-0" member={currentMember} />
          <span className="truncate">{currentMember.name}</span>
          <svg
            aria-hidden="true"
            className="size-3.5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </span>
      }
      onOpenChange={setIsOpen}
      panelClassName="w-64 p-1"
      triggerClassName="h-auto border-0 bg-transparent px-0 shadow-none hover:bg-transparent"
    >
      <div className="space-y-1" role="menu">
        {options.map((member) => {
          const isSelected =
            member.id === "__unassigned__"
              ? !selectedMember
              : member.id === selectedMember?.id;

          return (
            <button
              aria-checked={isSelected}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-body text-foreground transition-colors hover:bg-surface-muted",
                isSelected && "bg-surface-muted",
              )}
              key={member.id}
              onClick={() => {
                onSelect?.(member.id === "__unassigned__" ? null : member);
                setIsOpen(false);
              }}
              role="menuitemradio"
              type="button"
            >
              <span className="flex min-w-0 items-center gap-2">
                <MemberAvatar
                  className="shrink-0"
                  member={member.id === "__unassigned__" ? unassignedMember : member}
                />
                <span className="truncate">
                  {member.id === "__unassigned__" ? "Unassigned" : member.name}
                </span>
              </span>
              {isSelected ? (
                <svg
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </svg>
              ) : (
                <span className="size-4 shrink-0 rounded-sm border border-border" />
              )}
            </button>
          );
        })}
      </div>
    </Dropdown>
  );
}
