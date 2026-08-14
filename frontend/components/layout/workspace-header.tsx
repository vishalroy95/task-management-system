import Link from "next/link";

import { Button, IconButton } from "@/components/ui";
import { UserMenu } from "@/components/profile/user-menu";
import { currentUser } from "@/constants/user";

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7ZM13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function WorkspaceHeader() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-caption font-medium uppercase text-muted-foreground">
          Workspace
        </p>
        <h1 className="truncate text-title font-semibold text-foreground">
          Task Management System
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/tasks">
          <IconButton aria-label="Search" size="sm" variant="ghost">
            <SearchIcon />
          </IconButton>
        </Link>
        <IconButton aria-label="Notifications" size="sm" variant="ghost">
          <BellIcon />
        </IconButton>
        <Link href="/tasks">
          <Button className="hidden sm:inline-flex" size="sm" variant="secondary">
            New
          </Button>
        </Link>
        <UserMenu user={currentUser} />
      </div>
    </header>
  );
}
