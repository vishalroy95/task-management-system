"use client";

import Link from "next/link";

import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui";
import { colorThemes, themeModes } from "@/constants/theme";
import { cn } from "@/lib/cn";

export function SettingsProfilePage() {
  return (
    <div className="space-y-4 p-5">
      <div>
        <h1 className="text-title font-semibold text-foreground">Profile</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Profile settings are shared with the main profile screen.
        </p>
      </div>
      <Link href="/profile">
        <Button variant="secondary">Review profile</Button>
      </Link>
    </div>
  );
}

export function ThemeSettingsPage() {
  const { setThemeMode, themeMode } = useTheme();

  return (
    <div className="space-y-4 p-5">
      <div>
        <h1 className="text-title font-semibold text-foreground">Theme</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Choose the application appearance for this browser.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {themeModes.map((mode) => (
          <button
            className={cn(
              "rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-muted",
              themeMode === mode && "border-primary",
            )}
            key={mode}
            onClick={() => setThemeMode(mode)}
            type="button"
          >
            <span className="text-body font-semibold capitalize text-foreground">
              {mode}
            </span>
            <span className="mt-1 block text-caption text-muted-foreground">
              {mode === "light" ? "Clean bright interface" : "Lower-light interface"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ColorSettingsPage() {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <div className="space-y-4 p-5">
      <div>
        <h1 className="text-title font-semibold text-foreground">Color</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Select the accent color mode for primary actions.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {colorThemes.map((theme) => (
          <button
            className={cn(
              "rounded-lg border border-border bg-surface p-4 text-left capitalize transition-colors hover:bg-surface-muted",
              colorTheme === theme && "border-primary",
            )}
            key={theme}
            onClick={() => setColorTheme(theme)}
            type="button"
          >
            <span className="block text-body font-semibold text-foreground">
              {theme}
            </span>
            <span className="mt-2 block h-2 rounded-full bg-primary" />
          </button>
        ))}
      </div>
    </div>
  );
}
