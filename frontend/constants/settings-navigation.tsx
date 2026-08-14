import type { ReactNode } from "react";

export type SettingsNavigationItem = {
  href: string;
  icon: ReactNode;
  id: "profile" | "theme" | "color";
  label: string;
};

const iconClasses = "size-4";

export const settingsNavigation: SettingsNavigationItem[] = [
  {
    href: "/settings",
    icon: (
      <svg aria-hidden="true" className={iconClasses} fill="none" viewBox="0 0 24 24">
        <path
          d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    id: "profile",
    label: "Profile",
  },
  {
    href: "/settings/theme",
    icon: (
      <svg aria-hidden="true" className={iconClasses} fill="none" viewBox="0 0 24 24">
        <path
          d="M12 3a9 9 0 1 0 9 9c0-.5-.04-.99-.12-1.47A6 6 0 0 1 13.47 3.12C12.99 3.04 12.5 3 12 3Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    id: "theme",
    label: "Theme",
  },
  {
    href: "/settings/color",
    icon: (
      <svg aria-hidden="true" className={iconClasses} fill="none" viewBox="0 0 24 24">
        <path
          d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a1.5 1.5 0 0 1 0-3h2a6 6 0 0 0 0-12h-3Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    id: "color",
    label: "Color",
  },
];
