import { Button, Input } from "@/components/ui";
import { MemberAvatar } from "@/components/tasks/member-avatar";
import type { TaskComment } from "@/types/task";
import { useState } from "react";

type CommentListProps = {
  comments: TaskComment[];
  isSubmitting?: boolean;
  onSubmit?: (message: string) => Promise<void> | void;
};

export function CommentList({
  comments,
  isSubmitting = false,
  onSubmit,
}: CommentListProps) {
  const [message, setMessage] = useState("");

  return (
    <section className="rounded-lg border border-border bg-surface shadow-xs">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-body font-semibold text-foreground">Comments</h2>
      </div>
      <div className="space-y-4 p-4">
        {comments.map((comment) => (
          <article className="flex gap-3" key={comment.id}>
            <MemberAvatar member={comment.author} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="text-body font-semibold text-foreground">
                  {comment.author.name}
                </h3>
                <span className="text-caption text-muted-foreground">
                  {comment.timestamp}
                </span>
              </div>
              <p className="mt-1 text-body text-muted-foreground">{comment.message}</p>
            </div>
          </article>
        ))}

        <div className="flex gap-3 border-t border-border pt-4">
          <MemberAvatar
            member={{ id: "current-user", initials: "VR", name: "Vishal Ray" }}
          />
          <div className="min-w-0 flex-1 space-y-3">
            <Input
              aria-label="Write a reply"
              disabled={isSubmitting}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write a reply..."
              value={message}
            />
            <div className="flex justify-end">
              <Button
                disabled={isSubmitting || message.trim().length === 0}
                onClick={() => {
                  const nextMessage = message.trim();
                  setMessage("");
                  void onSubmit?.(nextMessage);
                }}
                size="sm"
              >
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
