"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("h-9 w-9", className)} />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300",
        isDark
          ? "border-white/15 bg-white/10 text-white hover:bg-white/20"
          : "border-slate-200 bg-white text-foreground hover:bg-slate-50",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={cn("h-4 w-4 absolute transition-all duration-300", isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100")} />
      <Moon className={cn("h-4 w-4 absolute transition-all duration-300", isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0")} />
    </button>
  );
}
