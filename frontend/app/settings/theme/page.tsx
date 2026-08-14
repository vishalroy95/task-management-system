import { ThemeSettingsPage } from "@/components/settings/settings-pages";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function ThemeSettingsRoute() {
  return (
    <SettingsShell activeItemId="theme">
      <ThemeSettingsPage />
    </SettingsShell>
  );
}
