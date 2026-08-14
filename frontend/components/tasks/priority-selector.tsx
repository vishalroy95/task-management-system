"use client";

import { CheckboxMenuItem, Dropdown } from "@/components/ui";
import { priorityOptions } from "@/lib/task-options";
import type { TaskPriority } from "@/types/task";

type PrioritySelectorProps =
  | {
      mode?: "single";
      onChange: (priority: TaskPriority) => void;
      triggerClassName?: string;
      value: TaskPriority;
    }
  | {
      mode: "multiple";
      onChange: (priorities: TaskPriority[]) => void;
      triggerClassName?: string;
      value: TaskPriority[];
    };

const priorityLabelByValue = Object.fromEntries(
  priorityOptions.map((option) => [option.value, option.label]),
) as Record<TaskPriority, string>;

function PriorityDot({ priority }: { priority: TaskPriority }) {
  const colorClass: Record<TaskPriority, string> = {
    high: "bg-priority-high",
    low: "bg-priority-low",
    medium: "bg-priority-medium",
    none: "bg-muted-foreground",
    urgent: "bg-priority-urgent",
  };

  return <span className={`size-2 rounded-full ${colorClass[priority]}`} />;
}

function togglePriority(values: TaskPriority[], priority: TaskPriority) {
  return values.includes(priority)
    ? values.filter((value) => value !== priority)
    : [...values, priority];
}

export function PrioritySelector(props: PrioritySelectorProps) {
  const selectedLabel =
    props.mode === "multiple"
      ? props.value.length > 0
        ? `${props.value.length} selected`
        : "Priority"
      : priorityLabelByValue[props.value];

  return (
    <Dropdown
      align="left"
      label={
        <>
          <PriorityDot
            priority={
              props.mode === "multiple" || !props.value ? "none" : props.value
            }
          />
          {selectedLabel}
        </>
      }
      panelClassName="w-56"
      triggerClassName={props.triggerClassName ?? "min-w-28 justify-start"}
    >
      {priorityOptions.map((option) => {
        const checked =
          props.mode === "multiple"
            ? props.value.includes(option.value)
            : props.value === option.value;

        return (
          <CheckboxMenuItem
            checked={checked}
            key={option.value}
            label={option.label}
            onClick={() => {
              if (props.mode === "multiple") {
                props.onChange(togglePriority(props.value, option.value));
                return;
              }

              props.onChange(option.value);
            }}
          />
        );
      })}
    </Dropdown>
  );
}
