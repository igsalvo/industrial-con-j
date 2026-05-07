"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="industrial-con-j-theme"
      disableTransitionOnChange
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </NextThemesProvider>
  );
}
