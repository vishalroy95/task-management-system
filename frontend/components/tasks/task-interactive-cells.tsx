"use client";

import { useState } from "react";

import { PrioritySelector } from "@/components/tasks/priority-selector";
import { DatePicker } from "@/components/ui/date-picker";
import { parseDisplayDate } from "@/lib/date";
import type { TaskPriority } from "@/types/task";

type TaskPriorityCellProps = {
  initialPriority: TaskPriority;
  onPriorityChange?: (priority: TaskPriority) => Promise<void> | void;
};

export function TaskPriorityCell({
  initialPriority,
  onPriorityChange,
}: TaskPriorityCellProps) {
  const [priority, setPriority] = useState(initialPriority);

  return (
    <PrioritySelector
      onChange={(nextPriority) => {
        setPriority(nextPriority);
        void onPriorityChange?.(nextPriority);
      }}
      value={priority}
    />
  );
}

type TaskDateCellProps = {
  initialDate: string;
  onDateChange?: (date: Date) => Promise<void> | void;
};

export function TaskDateCell({ initialDate, onDateChange }: TaskDateCellProps) {
  const [date, setDate] = useState(parseDisplayDate(initialDate));

  return (
    <DatePicker
      onChange={(nextDate) => {
        setDate(nextDate);
        void onDateChange?.(nextDate);
      }}
      value={date}
    />
  );
}
