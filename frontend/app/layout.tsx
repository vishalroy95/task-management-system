import type { Metadata } from "next";

import { AppToastContainer } from "@/components/ui/toast-container";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { defaultColorTheme, defaultThemeMode, themeStorageKeys } from "@/constants/theme";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ag Assignment",
  description: "Task management application foundation.",
};

const themeInitScript = `
(() => {
  try {
    const themeMode = localStorage.getItem("${themeStorageKeys.themeMode}") || "${defaultThemeMode}";
    const colorTheme = localStorage.getItem("${themeStorageKeys.colorTheme}") || "${defaultColorTheme}";
    document.documentElement.classList.toggle("dark", themeMode === "dark");
    document.documentElement.dataset.colorTheme = colorTheme;
  } catch {
    document.documentElement.dataset.colorTheme = "${defaultColorTheme}";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <AppToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
