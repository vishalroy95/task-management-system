import { SettingsProfilePage } from "@/components/settings/settings-pages";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function SettingsRoute() {
  return (
    <SettingsShell activeItemId="profile">
      <SettingsProfilePage />
    </SettingsShell>
  );
}
