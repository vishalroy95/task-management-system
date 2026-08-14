"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultColorTheme,
  defaultThemeMode,
  isColorTheme,
  isThemeMode,
  themeStorageKeys,
  type ColorTheme,
  type ThemeMode,
} from "@/constants/theme";

type ThemeContextValue = {
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  themeMode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(themeMode: ThemeMode, colorTheme: ColorTheme) {
  document.documentElement.classList.toggle("dark", themeMode === "dark");
  document.documentElement.dataset.colorTheme = colorTheme;
}

function getInitialThemeMode() {
  if (typeof window === "undefined") {
    return defaultThemeMode;
  }

  const storedThemeMode = window.localStorage.getItem(themeStorageKeys.themeMode);

  return isThemeMode(storedThemeMode) ? storedThemeMode : defaultThemeMode;
}

function getInitialColorTheme() {
  if (typeof window === "undefined") {
    return defaultColorTheme;
  }

  const storedColorTheme = window.localStorage.getItem(
    themeStorageKeys.colorTheme,
  );

  return isColorTheme(storedColorTheme) ? storedColorTheme : defaultColorTheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] =
    useState<ThemeMode>(getInitialThemeMode);
  const [colorTheme, setColorThemeState] =
    useState<ColorTheme>(getInitialColorTheme);

  useEffect(() => {
    applyTheme(themeMode, colorTheme);
  }, [colorTheme, themeMode]);

  const setThemeMode = useCallback((nextThemeMode: ThemeMode) => {
    setThemeModeState(nextThemeMode);
    window.localStorage.setItem(themeStorageKeys.themeMode, nextThemeMode);
    applyTheme(nextThemeMode, colorTheme);
  }, [colorTheme]);

  const setColorTheme = useCallback((nextColorTheme: ColorTheme) => {
    setColorThemeState(nextColorTheme);
    window.localStorage.setItem(themeStorageKeys.colorTheme, nextColorTheme);
    applyTheme(themeMode, nextColorTheme);
  }, [themeMode]);

  const value = useMemo(
    () => ({
      colorTheme,
      setColorTheme,
      setThemeMode,
      themeMode,
    }),
    [colorTheme, setColorTheme, setThemeMode, themeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return value;
}
