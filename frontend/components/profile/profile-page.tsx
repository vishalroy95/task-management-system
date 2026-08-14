"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, Button, Input } from "@/components/ui";
import type { UserProfile } from "@/types/user";

type ProfilePageProps = {
  user: UserProfile;
};

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-caption font-medium uppercase text-muted-foreground">
        {label}
      </span>
      <Input readOnly value={value} />
    </label>
  );
}

export function ProfilePage({ user }: ProfilePageProps) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isConfirmOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsConfirmOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConfirmOpen]);

  function handleConfirmLeave() {
    setIsConfirmOpen(false);
    router.push("/login");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="text-title font-semibold text-foreground">Profile</h2>
        <p className="mt-1 text-body text-muted-foreground">
          Manage personal information and workspace access.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-surface shadow-xs">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center">
          <Avatar
            alt={user.fullName}
            className="size-20 bg-primary text-2xl text-primary-foreground"
            fallback={user.avatarFallback}
          />
          <div className="min-w-0">
            <h1 className="text-title font-semibold text-foreground">
              {user.fullName}
            </h1>
            <p className="mt-1 text-body text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Email" value={user.email} />
          <Field label="Full Name" value={user.fullName} />
          <Field label="Title" value={user.title} />
          <Field label="Username" value={user.username} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-body font-semibold text-foreground">
              Workspace access
            </h2>
            <p className="mt-1 text-body text-muted-foreground">
              {user.workspaceRole} in Ag Workspace
            </p>
          </div>
          <Button onClick={() => setIsConfirmOpen(true)} variant="danger">
            Leave Workspace
          </Button>
        </div>
      </section>

      {isConfirmOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
          onClick={() => setIsConfirmOpen(false)}
          role="dialog"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-title font-semibold text-foreground">Leave Workspace</h2>
            <p className="mt-2 text-body text-muted-foreground">
              Are you sure you want to leave <span className="font-medium text-foreground">Ag Workspace</span>? You will be returned to the login screen and can rejoin anytime.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button onClick={() => setIsConfirmOpen(false)} type="button" variant="secondary">
                Cancel
              </Button>
              <Button
                className="bg-danger text-white hover:bg-danger/90"
                onClick={handleConfirmLeave}
                type="button"
              >
                Leave Workspace
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
