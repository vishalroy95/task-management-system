"use client";

import Link from "next/link";

import { useTheme } from "@/components/theme/theme-provider";
import { Avatar, Dropdown, MenuSection } from "@/components/ui";
import { colorThemes, themeModes } from "@/constants/theme";
import type { UserProfile } from "@/types/user";
import { cn } from "@/lib/cn";

import { notify } from "@/lib/toast";

type UserMenuProps = {
  user: UserProfile;
};

const menuLinkClasses =
  "flex w-full items-center rounded-md px-2 py-2 text-body text-foreground transition-colors hover:bg-surface-muted";

export function UserMenu({ user }: UserMenuProps) {
  const { colorTheme, setColorTheme, setThemeMode, themeMode } = useTheme();

  return (
    <Dropdown
      label={
        <>
          <Avatar alt={user.fullName} fallback={user.avatarFallback} size="sm" />
          <span className="hidden max-w-28 truncate sm:inline">{user.fullName}</span>
        </>
      }
      panelClassName="w-72"
      triggerClassName="h-10 border-0 bg-transparent px-2 shadow-none"
    >
      <div className="flex items-center gap-3 border-b border-border p-2 pb-3">
        <Avatar alt={user.fullName} fallback={user.avatarFallback} />
        <div className="min-w-0">
          <p className="truncate text-body font-semibold text-foreground">
            {user.fullName}
          </p>
          <p className="truncate text-caption text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <MenuSection title="Account">
        <Link className={menuLinkClasses} href="/profile">
          Profile
        </Link>
        <Link className={menuLinkClasses} href="/settings">
          Settings
        </Link>
        <Link
          className={cn(menuLinkClasses, "text-danger hover:bg-danger/10")}
          href="/login"
          onClick={() => notify.info("Logged out successfully.")}
        >
          Log out
        </Link>
      </MenuSection>

      <MenuSection title="Theme">
        {themeModes.map((mode) => (
          <button
            className={cn(menuLinkClasses, themeMode === mode && "bg-surface-muted")}
            key={mode}
            onClick={() => setThemeMode(mode)}
            type="button"
          >
            {mode === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </MenuSection>

      <MenuSection title="Color Mode">
        <div className="grid grid-cols-3 gap-1 px-1">
          {colorThemes.map((theme) => (
            <button
              className={cn(
                "rounded-md border border-border px-2 py-2 text-caption capitalize text-foreground transition-colors hover:bg-surface-muted",
                colorTheme === theme && "border-primary bg-surface-muted",
              )}
              key={theme}
              onClick={() => setColorTheme(theme)}
              type="button"
            >
              {theme}
            </button>
          ))}
        </div>
      </MenuSection>
    </Dropdown>
  );
}
