import Link from "next/link";

import { Input } from "@/components/ui";
import { settingsNavigation, type SettingsNavigationItem } from "@/constants/settings-navigation";
import { cn } from "@/lib/cn";

type SettingsSidebarProps = {
  activeItemId: SettingsNavigationItem["id"];
};

export function SettingsSidebar({ activeItemId }: SettingsSidebarProps) {
  return (
    <aside className="w-full shrink-0 border-b border-border bg-surface p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <Link
        className="inline-flex h-9 items-center rounded-md px-2 text-body font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        href="/tasks"
      >
        Back to app
      </Link>

      <div className="mt-4">
        <Input aria-label="Search settings" placeholder="Search settings" />
      </div>

      <nav aria-label="Settings navigation" className="mt-4">
        <ul className="space-y-1">
          {settingsNavigation.map((item) => {
            const isActive = item.id === activeItemId;

            return (
              <li key={item.id}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-body font-medium transition-colors",
                    "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )}
                  href={item.href}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
