import { Badge } from "@/components/ui";
import type { TaskResource } from "@/types/task";

type ResourceListProps = {
  resources: TaskResource[];
};

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <section className="rounded-lg border border-border bg-surface shadow-xs">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-body font-semibold text-foreground">Resources</h2>
      </div>
      <div className="divide-y divide-border">
        {resources.map((resource) => (
          <a
            className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-muted"
            href={resource.url}
            key={resource.id}
          >
            <span className="truncate text-body font-medium text-foreground">
              {resource.name}
            </span>
            <Badge>{resource.type}</Badge>
          </a>
        ))}
      </div>
    </section>
  );
}
