import type { ReactNode } from "react";

import { mainNavigation } from "@/constants/navigation";
import type { NavigationItem } from "@/constants/navigation";

import { Sidebar } from "./sidebar";
import { WorkspaceHeader } from "./workspace-header";

type AppShellProps = {
  activeItemId?: NavigationItem["id"];
  children: ReactNode;
};

const workspace = {
  fallback: "AG",
  name: "Ag Workspace",
};

export function AppShell({ activeItemId = "tasks", children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar
          activeItemId={activeItemId}
          navigation={mainNavigation}
          workspace={workspace}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <WorkspaceHeader />
          <main className="min-w-0 flex-1 bg-background p-4 sm:p-6">
            <div className="min-h-[calc(100vh-8rem)] rounded-lg border border-border bg-surface shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
