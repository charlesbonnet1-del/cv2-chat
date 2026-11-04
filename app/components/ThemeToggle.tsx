"use client";

import { useState, useEffect } from "react";

// Terminal-style theme switch. Default is the dark console;
// the "light" class on <html> enables the paper-terminal variant.
export default function ThemeToggle() {
  const [lightMode, setLightMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLightMode(document.documentElement.classList.contains("light"));
  }, []);

  const toggleTheme = () => {
    const next = !lightMode;
    document.documentElement.classList.toggle("light", next);
    setLightMode(next);
  };

  // Évite le flash d'hydratation
  if (!mounted) return <div className="w-[92px] h-7" />;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-7 px-2.5 text-[11px] border border-[var(--term-border)] text-[var(--term-dim)] hover:text-[var(--term-fg-bright)] hover:border-[var(--term-border-2)] transition-colors bg-transparent"
    >
      <span className={lightMode ? "text-[var(--term-muted)]" : "text-[var(--term-accent)]"}>dark</span>
      <span className="text-[var(--term-muted)]"> / </span>
      <span className={lightMode ? "text-[var(--term-accent)]" : "text-[var(--term-muted)]"}>light</span>
    </button>
  );
}
