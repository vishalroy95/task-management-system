export const colorThemes = ["amber", "blue", "pink", "rose", "emerald", "black"] as const;

export type ColorTheme = (typeof colorThemes)[number];

export const themeModes = ["light", "dark"] as const;

export type ThemeMode = (typeof themeModes)[number];

export const defaultThemeMode: ThemeMode = "light";

export const defaultColorTheme: ColorTheme = "blue";

export const themeStorageKeys = {
  colorTheme: "ag-assignment-color-theme",
  themeMode: "ag-assignment-theme-mode",
} as const;

export function isThemeMode(value: string | null): value is ThemeMode {
  return themeModes.includes(value as ThemeMode);
}

export function isColorTheme(value: string | null): value is ColorTheme {
  return colorThemes.includes(value as ColorTheme);
}
