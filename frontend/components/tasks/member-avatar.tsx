import { Avatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { TaskMember } from "@/types/task";

type MemberAvatarProps = {
  className?: string;
  member: TaskMember;
};

export function MemberAvatar({ className, member }: MemberAvatarProps) {
  return (
    <Avatar
      alt={member.name}
      className={cn("border-2 border-surface bg-surface-muted", className)}
      fallback={member.initials}
      size="sm"
      title={member.name}
    />
  );
}
