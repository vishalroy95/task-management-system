import type { ReactNode } from "react";

export type NavigationItem = {
  href: string;
  icon: ReactNode;
  id: "tasks" | "projects";
  label: string;
};

const iconClasses = "size-4";

export const mainNavigation: NavigationItem[] = [
  {
    href: "/tasks",
    icon: (
      <svg
        aria-hidden="true"
        className={iconClasses}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    id: "tasks",
    label: "Tasks",
  },
  {
    href: "/projects",
    icon: (
      <svg
        aria-hidden="true"
        className={iconClasses}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4.25l2 2H18.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    id: "projects",
    label: "Projects",
  },
];
