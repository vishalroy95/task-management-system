"use client";

import { ToastContainer as ReactToastifyContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useTheme } from "@/components/theme/theme-provider";

export function AppToastContainer() {
  const { themeMode } = useTheme();

  return (
    <ReactToastifyContainer
      autoClose={3000}
      closeOnClick
      draggable
      hideProgressBar={false}
      newestOnTop
      pauseOnFocusLoss
      pauseOnHover
      position="top-right"
      theme={themeMode === "dark" ? "dark" : "light"}
      toastClassName="font-sans text-sm shadow-soft rounded-xl border border-border"
    />
  );
}
