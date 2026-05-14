"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export function Providers({ children, showThemeToggle = false }: { children: ReactNode; showThemeToggle?: boolean }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme={showThemeToggle ? undefined : "dark"}
      storageKey="industrial-con-j-theme"
      disableTransitionOnChange
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </NextThemesProvider>
  );
}
