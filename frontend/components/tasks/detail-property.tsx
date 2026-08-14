import type { ReactNode } from "react";

type DetailPropertyProps = {
  children: ReactNode;
  label: string;
};

export function DetailProperty({ children, label }: DetailPropertyProps) {
  return (
    <div className="grid grid-cols-[7rem_1fr] items-start gap-3 py-2">
      <dt className="text-caption font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 text-body text-foreground">{children}</dd>
    </div>
  );
}
