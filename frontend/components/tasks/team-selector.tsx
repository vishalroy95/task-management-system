"use client";

import { CheckboxMenuItem, Dropdown } from "@/components/ui";

type TeamSelectorProps = {
  onChange?: (team: string) => void;
  selectedTeam?: string;
  teams?: string[];
  triggerClassName?: string;
};

const defaultTeams = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Core Operations",
];

export function TeamSelector({
  onChange,
  selectedTeam,
  teams = defaultTeams,
  triggerClassName,
}: TeamSelectorProps) {
  const currentTeam = selectedTeam || teams[0] || "Select Team";

  return (
    <Dropdown
      align="left"
      label={<span className="truncate">{currentTeam}</span>}
      panelClassName="w-52"
      triggerClassName={triggerClassName ?? "min-w-36 justify-between"}
    >
      <div className="space-y-1" role="menu">
        {teams.map((team) => {
          const isSelected = team === selectedTeam;

          return (
            <CheckboxMenuItem
              checked={isSelected}
              key={team}
              label={team}
              onClick={() => onChange?.(team)}
            />
          );
        })}
      </div>
    </Dropdown>
  );
}
