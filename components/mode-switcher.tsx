"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { META_THEME_COLORS } from "@/config/site";
import { Button } from "./ui/button";
import { useMetaColor } from "@/hooks/use-meta-color";
import { cn } from "@/lib/utils";

export function ModeSwitcher({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  return (
    <Button
      variant="ghost"
      className="w-8 h-8 px-0 group/toggle"
      onClick={toggleTheme}
    >
      <SunIcon className={cn("hidden [html.dark_&]:block", className)} />
      <MoonIcon className={cn("hidden [html.light_&]:block", className)} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
