"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="transparent"
      className="size-10 rounded-xl p-0 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 premium-lift"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        strokeWidth={1.5}
      />
      <Moon
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        strokeWidth={1.5}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
