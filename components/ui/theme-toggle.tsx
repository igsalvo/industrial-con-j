"use client";

import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button type="button" className="btn-secondary gap-2 !px-4 !py-3 text-sm" aria-label="Cambiar tema" disabled>
        <span className="h-4 w-4 rounded-full border border-[color:var(--line)]" />
        Tema
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button type="button" onClick={() => setTheme(isDark ? "light" : "dark")} className="btn-secondary gap-2 !px-4 !py-3 text-sm">
      {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
      {isDark ? "Modo claro" : "Modo oscuro"}
    </button>
  );
}
