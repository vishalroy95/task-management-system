import type { ReactNode } from "react";

import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import type { SettingsNavigationItem } from "@/constants/settings-navigation";

type SettingsShellProps = {
  activeItemId: SettingsNavigationItem["id"];
  children: ReactNode;
};

export function SettingsShell({ activeItemId, children }: SettingsShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col md:flex-row">
        <SettingsSidebar activeItemId={activeItemId} />
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="min-h-[calc(100vh-3rem)] rounded-lg border border-border bg-surface shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
