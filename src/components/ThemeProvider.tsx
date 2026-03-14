"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useChatStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
