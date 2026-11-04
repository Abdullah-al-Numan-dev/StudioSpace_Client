"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="btn btn-ghost btn-circle" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="btn btn-ghost btn-circle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}