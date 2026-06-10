import { useEffect, useState } from "react";

export type AppTheme = "bunker-dark" | "bunker-light";

const STORAGE_KEY = "bunker-theme";

function getInitialTheme(): AppTheme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "bunker-light" || stored === "bunker-dark") return stored;

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "bunker-light"
    : "bunker-dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) =>
      current === "bunker-dark" ? "bunker-light" : "bunker-dark"
    );

  return { theme, toggleTheme };
}
