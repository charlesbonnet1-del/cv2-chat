
"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Vérifie si l'utilisateur préfère le sombre par défaut
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: "transparent",
        border: "1px solid currentColor",
        padding: "8px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        cursor: "pointer",
        opacity: 0.7,
        fontFamily: "var(--font-sans)",
      }}
    >
      {darkMode ? "☀ Light Mode" : "☾ Dark Mode"}
    </button>
  );
}
