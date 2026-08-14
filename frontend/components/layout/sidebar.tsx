import Link from "next/link";

import type { NavigationItem } from "@/constants/navigation";
import { cn } from "@/lib/cn";

import { WorkspaceSelector } from "./workspace-selector";

type Workspace = {
  name: string;
  fallback: string;
};

type SidebarProps = {
  activeItemId: NavigationItem["id"];
  navigation: NavigationItem[];
  workspace: Workspace;
};

export function Sidebar({
  activeItemId,
  navigation,
  workspace,
}: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="border-b border-border p-4">
        <WorkspaceSelector workspace={workspace} />
      </div>

      <nav aria-label="Main navigation" className="flex-1 p-3">
        <ul className="flex gap-2 md:flex-col">
          {navigation.map((item) => {
            const isActive = item.id === activeItemId;

            return (
              <li className="min-w-0 flex-1 md:flex-none" key={item.id}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-body font-medium transition-colors",
                    "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                    isActive &&
                      "bg-primary text-primary-foreground shadow-xs hover:bg-primary hover:text-primary-foreground",
                  )}
                  href={item.href}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
