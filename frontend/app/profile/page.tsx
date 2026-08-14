import { AppShell } from "@/components/layout/app-shell";
import { ProfilePage } from "@/components/profile/profile-page";
import { currentUser } from "@/constants/user";

export default function ProfileRoute() {
  return (
    <AppShell>
      <ProfilePage user={currentUser} />
    </AppShell>
  );
}
