import { Badge } from "@/components/ui";
import type { TaskPriority } from "@/types/task";

type PriorityBadgeProps = {
  priority: TaskPriority;
};

const priorityConfig: Record<
  TaskPriority,
  {
    label: string;
    variant:
      | "default"
      | "priorityLow"
      | "priorityMedium"
      | "priorityHigh"
      | "priorityUrgent";
  }
> = {
  high: {
    label: "High",
    variant: "priorityHigh",
  },
  low: {
    label: "Low",
    variant: "priorityLow",
  },
  medium: {
    label: "Medium",
    variant: "priorityMedium",
  },
  none: {
    label: "No Priority",
    variant: "default",
  },
  urgent: {
    label: "Urgent",
    variant: "priorityUrgent",
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
