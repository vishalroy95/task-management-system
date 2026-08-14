import type { TaskUpdate } from "@/types/task";

type UpdateListProps = {
  updates: TaskUpdate[];
};

export function UpdateList({ updates }: UpdateListProps) {
  return (
    <section className="rounded-lg border border-border bg-surface shadow-xs">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-body font-semibold text-foreground">Updates</h2>
      </div>
      <ol className="space-y-3 p-4">
        {updates.map((update) => (
          <li className="flex gap-3" key={update.id}>
            <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
            <span className="min-w-0">
              <span className="block text-body text-foreground">{update.message}</span>
              <span className="text-caption text-muted-foreground">
                {update.timestamp}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
