"use client";

import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("industrial-con-j-theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button type="button" onClick={toggle} className="btn-secondary gap-2 !px-4 !py-3 text-sm">
      {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
      {isDark ? "Modo claro" : "Modo oscuro"}
    </button>
  );
}
