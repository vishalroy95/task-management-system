import { ColorSettingsPage } from "@/components/settings/settings-pages";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function ColorSettingsRoute() {
  return (
    <SettingsShell activeItemId="color">
      <ColorSettingsPage />
    </SettingsShell>
  );
}
